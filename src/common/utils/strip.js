export function LRStrip(Str){
    var Special_Symbol = ["+", "-", "*", "%"]
    let Copy_Str = ""
    let Start = 0;
    let End = Str.length - 1
    while((Str[Start] == " " || Special_Symbol.indexOf(Str[Start]) != -1) && Start < Str.length){
        Start = Start + 1
    }
    while((Str[End] == " " || Special_Symbol.indexOf(Str[End]) != -1) && End > Start){
        End = End - 1
    }
    for(; Start <= End; Start++){
        Copy_Str = Copy_Str + Str[Start]
    }
    return Copy_Str
}