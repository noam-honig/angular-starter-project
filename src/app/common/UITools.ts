import { FieldRef } from 'remult'
import {
  GeocodeResult,
  Location,
} from '../common-ui-elements/address-input/google-api-helpers'

export interface UITools {
  selectValuesDialog<
    T extends {
      caption?: string
    }
  >(args: {
    values: T[]
    onSelect: (selected: T) => void
    title?: string
  }): Promise<void>
  yesNoQuestion: (question: string) => Promise<boolean>
  info: (info: string) => void
  error: (err: any) => void
}

export interface customInputOptions {
  inputAddress(
    onSelect?: (result: InputAddressResult, entityInstance: any) => void
  ): void
  textarea(): void
}

declare module 'remult' {
  // Adding options to the remult's Field Options interface
  export interface FieldOptions<entityType, valueType> {
    clickWithUI?: (
      ui: UITools,
      entity: entityType,
      fieldRef: FieldRef<valueType>
    ) => void
    customInput?: (inputOptions: customInputOptions) => void
  }
}

export interface InputAddressResult {
  addressByGoogle: string
  location: Location
  city: string
  autoCompleteResult: GeocodeResult
}
