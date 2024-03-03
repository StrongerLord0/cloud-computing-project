
const checkEmotionRec = require('../Misa')

test('Reconoce las emociones', ()=>{
    expect(checkEmotionRec('feliz')).toBe(true)
    expect(checkEmotionRec('triste')).toBe(true)
    expect(checkEmotionRec('melancolico')).toBe(true)
    expect(checkEmotionRec('enojado')).toBe(true)
    expect(checkEmotionRec('aguitado')).toBe(false)
    expect(checkEmotionRec('normal')).toBe(false)
    expect(checkEmotionRec('4')).toBe(false)
    expect(checkEmotionRec('')).toBe(false)
})