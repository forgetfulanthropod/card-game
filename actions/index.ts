import { exportFunctions } from 'better-firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

exportFunctions({ __filename, exports, })
