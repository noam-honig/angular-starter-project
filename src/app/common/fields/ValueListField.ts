import { Field, FieldOptions, FieldRef } from 'remult'

export function ValueListField<entityType, valueType>(
  valueList: readonly valueType[],
  options?: FieldOptions<entityType, valueType>
) {
  const validate:
    | ((
        entity: entityType,
        fieldRef: FieldRef<entityType, valueType>
      ) => any | Promise<any>)
    | ((
        entity: entityType,
        fieldRef: FieldRef<entityType, valueType>
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
  return Field<entityType, valueType>(undefined, {
    valueList: valueList.map((x) => ({ id: x, caption: x })),
    ...options,
    validate,
  })
}
