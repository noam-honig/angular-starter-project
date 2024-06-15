import { MatDialogConfig } from '@angular/material/dialog'
import { dialogConfigMember } from './dialogConfigMember'

export function DialogConfig(config: MatDialogConfig) {
  return function (target: any) {
    target[dialogConfigMember] = config
    return target
  }
}
