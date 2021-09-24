declare module '@ioc:Adonis/Core/Validator' {
  interface Rules {
    checkNumber(id: number): Rule
  }
}
