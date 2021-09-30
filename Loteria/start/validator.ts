import { string } from '@ioc:Adonis/Core/Helpers'
import { validator } from '@ioc:Adonis/Core/Validator'
/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
validator.rule('camelCase', (value, [id], options) => {
  // Rest of the validation
  console.log(value, id)
  /*if (maxLength && value.length > maxLength) {
    options.errorReporter.report(
      options.pointer,
      'camelCase.maxLength', // 👈 Keep an eye on this
      'camelCase.maxLength validation failed',
      options.arrayExpressionPointer,
      { maxLength }
    )
  }*/
})
