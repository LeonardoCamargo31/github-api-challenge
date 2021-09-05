import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default {
  schema: schema.create({
    name: schema.string({}, [rules.maxLength(100)]),
    description: schema.string({}, [rules.maxLength(100)]),
    public: schema.boolean(),
  }),
  messages: {
    required: 'the {{ field }} is required to create a new repository',
  },
}
