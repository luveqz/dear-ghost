describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')

    cy.get('body').contains('Prompts', {
      timeout: 30000,
    })
    cy.get('body').contains('Chat')
    cy.get('body').contains('History')
  })
})
