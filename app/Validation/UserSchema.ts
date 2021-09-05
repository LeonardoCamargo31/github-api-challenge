import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default {
  schema: schema.create({
    name: schema.string({}, [rules.maxLength(100)]),
    email: schema.string({}, [
      rules.email(),
      rules.maxLength(100),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    avatar: schema.string({}, [rules.maxLength(100)]),
    location: schema.string({}, [rules.maxLength(100)]),
    username: schema.string({}, [
      rules.alpha({
        allow: ['underscore'],
      }),
      rules.maxLength(100),
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    bio: schema.string({}, []),
  }),
  messages: {
    'required': 'The {{ field }} is required to create a new user',
    'username.unique': 'Username not available',
    'email.email': 'Invalid email format',
  },
}
