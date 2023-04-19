import { getServerEnv } from '@/../shared/code'
import {
    InfluxDB,
    Point,
    DEFAULT_WriteOptions,
} from '@influxdata/influxdb-client'

import { getLogger } from 'game'

const logger = getLogger()
let _db: InfluxDB
let enableMetrics: boolean = true

let influxOrg: string
let influxBucket: string

const getInfluxDb = (): InfluxDB | undefined => {
    if (_db) return _db
    const influxUrl = getServerEnv('INFLUX_URL')
    const influxApiToken = getServerEnv('INFLUX_TOKEN')
    if (!influxUrl || !influxApiToken) {
        logger.error(
            'no influx url or token defined. check your INFLUX_URL and INFLUX_TOKEN variable in env'
        )
        logger.error('METRICS DISABLED')
        enableMetrics = false
        return
    }
    influxOrg = getServerEnv('INFLUX_ORG')
    influxBucket = getServerEnv('INFLUX_BUCKET')
    if (!influxOrg || !influxBucket) {
        logger.error(
            'no influx organization or bucket defined. check your INFLUX_ORG and INFLUX_BUCKET variables in env'
        )
        logger.error('METRICS DISABLED')
        enableMetrics = false
        return
    }
    _db = new InfluxDB({
        url: influxUrl,
        token: influxApiToken,
    })
    return _db
}

export enum FieldType {
    'int',
    'float',
    'string',
}

interface MetricField {
    name: string
    type: FieldType
    value: number | string
}

interface MetricFieldOptional {
    name?: string
    type?: FieldType
    value?: number | string
}

const defaultMetricField: MetricField = {
    name: 'value',
    type: FieldType.int,
    value: 1,
}

export function metricField(): MetricField
export function metricField(obj: MetricFieldOptional): MetricField
export function metricField(
    t: MetricFieldOptional | undefined = undefined
): MetricField {
    if (!t) return defaultMetricField
    else return { ...defaultMetricField, ...t }
}

const writeOptions = {
    batchSize: DEFAULT_WriteOptions.batchSize,
    flushInterval: DEFAULT_WriteOptions.flushInterval,
}

// TODO: allow for data points with multiple values
export const writeMetric = (
    name: string,
    tags = {},
    fields: MetricFieldOptional[] = [defaultMetricField]
) => {
    if (!enableMetrics) return
    try {
        let point = new Point(name)
        fields.forEach(field => {
            const finalField = metricField(field)
            if (finalField.type == FieldType.int)
                point.intField(finalField.name, finalField.value)
            else if (finalField.type == FieldType.float)
                point.floatField(finalField.name, finalField.value)
            else point.stringField(finalField.name, finalField.value)
        })
        for (const [tagKey, tagValue] of Object.entries(tags)) {
            try {
                let tagString = String(tagValue)
                if (tagString != '' && tagString.slice(-1) != '\\') {
                    point.tag(tagKey, tagString)
                }
            } catch (e) {
                const err = e as Error
                logger.error(
                    `failed to create tag for metric ${name}: tag ${tagKey}: ${tagValue}: ${err.message}. ${err.stack}`
                )
            }
        }
        let db = getInfluxDb()
        if (!db) {
            logger.error('could not get influxDB connection')
            return
        }
        const writeApi = db.getWriteApi(
            influxOrg,
            influxBucket,
            'ns',
            writeOptions
        )
        writeApi.writePoint(point)
        const fieldMsg = JSON.stringify(point.fields)
        // @ts-expect-error
        const tagMsg = JSON.stringify(point.tags)
        logger.debug(`metric sent for writing ${name}: ${fieldMsg}, ${tagMsg}`)
    } catch (e) {
        const err = e as Error
        logger.error(
            `writing metric failed ${name}: ${err.message}: ${err.stack}`
        )
    }
}
