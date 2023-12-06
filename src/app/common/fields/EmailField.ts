import { FieldRef, Fields, StringFieldOptions } from 'remult'

export function EmailField<entityType>(
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
      if (!f.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        throw Error('אימייל לא תקין')
      }
    },
  ]
  if (options?.validate) {
    if (!Array.isArray(options.validate)) options.validate = [options.validate]
    validate.push(...options.validate)
  }
  return Fields.string({
    caption: 'אימייל',
    inputType: 'email',
    ...options,
    validate,
  })
}
