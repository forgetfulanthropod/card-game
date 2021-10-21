import { exportFunctions } from 'better-firebase-functions'
import * as admin from 'firebase-admin'

exportFunctions({ __filename, exports, })
const firebaseConfig = {
    projectId: 'kaiju-75e84',
}
admin.initializeApp(firebaseConfig)
