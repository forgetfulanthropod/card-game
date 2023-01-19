import { InfluxDB, Point } from '@influxdata/influxdb-client'

import { getLogger } from 'game'

const logger = getLogger()
let _db: InfluxDB
let enableMetrics = true

const getInfluxDb = () => {
    if (_db) return _db
    const influxUrl = process.env.INFLUX_URL || ''
    const influxApiToken = process.env.INFLUX_TOKEN || ''
    if (!influxUrl || !influxApiToken) {
        logger.error(
            'no influx url or token defined. check your INFLUX_URL and INFLUX_TOKEN variable in env'
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

// TODO: allow for data points with multiple values
export const writeMetric = (
    name: string,
    value: any,
    tags = {},
    valueType = 0
) => {
    if (!enableMetrics) {
        return
    }
    const influxOrg = process.env.INFLUX_ORG
    const influxBucket = process.env.INFLUX_BUCKET
    if (!influxOrg || !influxBucket) {
        logger.error(
            'no influx organization or bucket defined. check your INFLUX_ORG and INFLUX_BUCKET variables in env'
        )
        logger.error('METRICS DISABLED')
        enableMetrics = false
        return
    }
    try {
        let point = new Point(name)
        if (valueType == 0) {
            point = point.intField('value', value)
        } else if (valueType == 1) {
            point = new Point(name).floatField('value', value)
        } else {
            point = new Point(name).stringField('value', value)
        }
        for (const [tagKey, tagValue] of Object.entries(tags)) {
            try {
                let tagString = String(tagValue)
                if (tagString != '' && tagString.slice(-1) != '\\') {
                    point = point.tag(tagKey, tagString)
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
            logger.error('could not get db connection')
            return
        }
        const writeApi = db.getWriteApi(influxOrg, influxBucket)
        writeApi.writePoint(point)
        writeApi.close().then(() => {
            logger.debug(
                `metric written: ${name}: ${value}, ${JSON.stringify(tags)}`
            )
        })
    } catch (e) {
        const err = e as Error
        logger.error(`writing metric failed ${err.message}: ${err.stack}`)
    }
}
