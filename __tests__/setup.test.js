describe('Setup Test', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true)
  })

  it('should have testing library matchers', () => {
    const element = document.createElement('div')
    element.textContent = 'Hello Test'
    document.body.appendChild(element)
    expect(element).toBeInTheDocument()
    document.body.removeChild(element)
  })
})
