import { FieldRef, Fields, StringFieldOptions } from 'remult'

export function ValueListField<entityType>(
  valueList: string[],
  options?: StringFieldOptions<entityType>
) {
  const validate:
    | ((
        entity: entityType,
        fieldRef: FieldRef<entityType, string>
      ) => any | Promise<any>)
    | ((
        entity: entityType,
        fieldRef: FieldRef<entityType, string>
      ) => any | Promise<any>)[] = [
    (_, f) => {
      if (!f.value) return
      //is valid email
      if (!valueList.includes(f.value)) {
        throw Error('ערך לא חוקי: ' + f.value)
      }
    },
  ]
  if (options?.validate) {
    if (!Array.isArray(options.validate)) options.validate = [options.validate]
    validate.push(...options.validate)
  }
  return Fields.string({
    valueList,
    ...options,
    validate,
  })
}
