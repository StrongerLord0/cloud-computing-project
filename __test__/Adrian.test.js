const checkImageExtension = require('../Adrian')

test('Reconoce las extensiones', ()=>{
    expect(checkImageExtension('jpg')).toBe(true)
    expect(checkImageExtension('PNG')).toBe(true)
    expect(checkImageExtension('JpEg')).toBe(true)
    expect(checkImageExtension('mp4')).toBe(false)
    expect(checkImageExtension('HOLA')).toBe(false)
})
