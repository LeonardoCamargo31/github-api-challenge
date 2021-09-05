import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default (idUser?: number) => {
  return {
    schema: schema.create({
      name: schema.string({}, [rules.maxLength(100)]),
      email: schema.string({}, [
        rules.email(),
        rules.maxLength(100),
        rules.unique({ table: 'users', column: 'email', whereNot: { id: idUser || null } }),
      ]),
      avatar: schema.string({}, [rules.maxLength(100)]),
      location: schema.string({}, [rules.maxLength(100)]),
      username: schema.string({}, [
        rules.alpha({
          allow: ['underscore'],
        }),
        rules.maxLength(100),
        rules.unique({ table: 'users', column: 'username', whereNot: { id: idUser || null } }),
      ]),
      bio: schema.string({}, []),
    }),
    messages: {
      'required': 'the {{ field }} is required to create a new user',
      'username.unique': 'username not available',
      'email.email': 'invalid email format',
    },
  }
}
