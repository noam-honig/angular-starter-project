import { MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog'
import { dialogConfigMember } from './dialogConfigMember'

export function DialogConfig(config: MatDialogConfig) {
  return function (target: any) {
    target[dialogConfigMember] = config
    return target
  }
}
