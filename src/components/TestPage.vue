// 这一页面主要用于测试各类新功能的显示是否符合具体要求，等待完成后再放到正式页面上去

<template>
    <div>
        <el-row style="margin: 30px 50px 0px 50px">
            {{TestData.title}}
        </el-row>
        <el-row v-for="(Question_Info, Question_Index) in TestData.doc" :key="Question_Index">
            <!-- 题型，上传用户，科目部分 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px 0px 50px">
                <el-col :span="2" style="text-align: left">
                    {{Get_Question_Type(Question_Info.question_type)}}
                </el-col>
                <el-col :span="3" style="text-align: left">
                    提交者：{{Question_Info.source}}
                </el-col>
                <el-col :span="3" style="text-align: left">
                    科目：{{Question_Info.subject}}
                </el-col>
            </el-row>
            <!-- 题干部分 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px" v-html="Get_Question_Show(Question_Info.question_stem, 'stem')">
                
            </el-row>
            <!-- 选项部分 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px" 
                    v-for="(Question_Option, Option_Index) in Question_Info.question_options" 
                    :key="Option_Index" 
                    v-html="Get_Question_Options(Question_Option, Option_Index)">
                    
            </el-row>
            <!-- 答案部分 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px" v-html="Get_Question_Show(Question_Info.answer, 'answer')">
               
            </el-row>
            <!-- 解析部分 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px" v-html="Get_Question_Show(Question_Info.analysis, 'analyse')">

            </el-row>
        </el-row>
    </div>
</template>
<script>

export default {

    components: {},
    name: "TestPage",
    data(){
        return {
            TestData: {
                "title": "2009年课标甲乙",
                "doc": [
                    {
                    "question_ID": 0,
                    "question_stem": "已知集合<IMG: 2019年高考理科数学（全国Ⅰ卷）试题-HTML.001.png>，<IMG: 2019年高考理科数学（全国Ⅰ卷）试题-HTML.002.png>，则<IMG: 2019年高考理科数学（全国Ⅰ卷）试题-HTML.003.png>",
                    "question_options": ["<IMG: 2019年高考理科数学（全国Ⅰ卷）试题-HTML.004.png>",
                                        "<IMG: 2019年高考理科数学（全国Ⅰ卷）试题-HTML.005.png>",
                                        "<IMG: 2019年高考理科数学（全国Ⅰ卷）试题-HTML.006.png>",
                                        "<IMG: 2019年高考理科数学（全国Ⅰ卷）试题-HTML.007.png>"],
                    "answer": "A",
                    "analysis": "",
                    "question_type": "SingleChoice",
                    "source": "用户6657",
                    "subject": "数学"
                    }
                ],
                "img": {
                    "2019年高考理科数学（全国Ⅰ卷）试题-HTML.001.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAAAUCAYAAAC+sgIEAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACtklEQVR4nO1YQYRWURQ+krTIMJIkiZYjiaRFkqFFkqRNkrSIMZKRRDIyi0RazCptMlqMDEmSkSFpMYu2aZG0GZlVokWSjOH1fd37dOe5971z752/v6n78fH/575z7vnPuefc836RgoKCgoI/jGtgBS6D6wLP7LPrP1Zhv0vgYoJelbHnFvBThn6vMQjOgUvgSzH+EozTWKyxK2KCtcuzNgAugE8knGwtLoKT4NYE3ZxkzmXq9xoT4B4x8b0DPrZyxukeeDnG2FPwDXjMs/YQ/AweSfXUwbcM3dRksBNcT9AfAp8n7hlr86zzmcXT7IDftRusB9+D98EzjbUL4Dj4VfKrkvAFtLLkD9og5vAsKHW7MGTtxehvBx+Ar8EDAT80/sbYbOKLZ08VToB3wVHwtiNnINhaT4MzWmMdWArIuRd/KNvJYOCZ2GQy0I/ATUp9VsQt8K2YmLRB42+szRq0N9mQLSt1f1UkN2LSpq1sI/gK3GxlzYp1UbXQBVv4ixY7PI17O/aJATvKTqU+Z4Z3YlqytgN1+ZtikzgnK/0m5kV5GDgxsdUeBWetjAk+bD/zvhyIcCaEyrHZBKvoo/jvbFffJ4ulD5zoP4ipNE3gNf7G2hT73HmP/JAoDvN++Z3AHWISxyqcsLKDYiq0DdrA8WTNB2xwuLoJ3ujYJwdd+mxvnCRZTac6ntX4G2uTGA7I+bpyvE2Rp4Bj75jznb35mfOdk9dVhRNahO5MJvqkmJE8tF+vk1mDh3pK2ocVjb+xNuvXtd1ihiUXrXcmL3C3guo7cdEaHW6s+0o/Bb6AcpLmtMdWzhM8HqGbu3cbGKNZj1zrb4zNGVkZ76nG+l/5jtyP98x/ATlx6xn4DxBb+7YE3f8xmfU/QKP9diSEEel+yfZhNf4XXmtgnEb67URBQUFBQcFax0/1H7ojtI+z7QAAAABJRU5ErkJggg==",
                    "2019年高考理科数学（全国Ⅰ卷）试题-HTML.002.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAAAXCAYAAADHqJcNAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACwklEQVR4nO2YMWhUQRCGB4tgIYKIiIjYWYiFYBFEJAgiIYiIICGkshERERHBQsRC0liIiAgWIhYSEAsLsZEQQop0IhYiNiIidlYiIsI5P/Pe3WV9s7tvd+9Oufng5969u5nZfTs7u2+JDMMwDMMwxpfTrIOjboQxWo6zjrGesg6MuC3/FV9YHdY95/5cdb/Whsw4F1ifE+w6ifFQFQ4l2g6DSdYK61emn5nKR6f6nK7u41lfbOMIA3yH9Y3+HmwM3mvWppyWMudZt1nbE2xTE+Fcot0wOMp6T5KsE5m++gd/mnqJhWd9n3WpjbNF1kfWrHP/Lutsehu7fM+wTUmEI5SfvINiK2uNta2l3V7Wy4b77vNxv/+IDYAqgGowxXrh/Ias3RzryEPTYNZLzjzJrHhCkoy5tqg+z1kPSWZcDrFtbMN11mPWV1o/mzV2sh6RJM+k0sY231VQphar6w/UK9/7SDpeAm0dRJajgyhfW5T/aB2JsS1B6ThvSCoW6C/lLpiAC6y3rBMef6GB/x3bMGwS56trZOvl6voGye5bC67JBZuZV574qEb7Pb/7MjpkW4qScdyBb+ofxuAdyR4ttEkPJcIq+ROpyyfqZfpukgwE7jKRCho2pfw2UcWfCdin2mr+YpM4Jk5bfzGl+ypJdUYVyk2Ew562dMF79opzb5mk0wuB4LGdRzauKn6wLN0kqUS+WKm2JSgdJ3YNx+S8RVIZTmX4WyI5W1FBpj0gyb5+zpBsZPb4jFuirYNIkpOsZ6wryn+0BxVjW4LScbTXPY1dJBtfbbMY8ufdI2yk9bO4fw1BKVwONK4tTYOJNxLsiLEpQtZfG4BtLoOIUw9WfQAUu7Rh09q0XIf8pZ7DDIRhnyMYPXKefXHwbo9Trh0JtpYIadQni//cCStOKFMOY36WbsiYgGdd4lTYMAzDMIwx4g85zMo5AofrygAAAABJRU5ErkJggg==",
                    "2019年高考理科数学（全国Ⅰ卷）试题-HTML.003.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAATCAYAAADF7c7rAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB20lEQVR4nO2WwUdEURTGj4yMJEbSIhlatEi7pFVmk6RFZpfRIokkrWYzWmS0iJZJImmVRIskSZuM0T+QWaVNkrSI1skwfcc9oze3d96b+6KU9/Ez953jnnfuveeeN0SxYtlKgBVwB97ldxW0/GZSXhVADVRJT2pI/G+WvRVcgz2QFltanssgqcR7knduW/ac2Oskml1EmPISsM/HlwIP4Ii+bsAa2FFi7oJ1xcdxNsGrT8xlUAHtoVk76BTcgEkf37EkMurj45PoUWL2gueAd/KG3YNpy74FFoKSdRWXwS2ZspqxfPOgCF6UudWQ2JqfT403LQPOLR/n0hES10lTZMpsEWx47APghMwOHyhzayGxNf8YmRNkcVPqlvEgOAyJ6Sw+uSw1LqQNXIFOSSSrzI26QG4u9WrhjpuXMVfLeEAsjUA9kinTCfosl30yd45LictT64ZRF8hNKyVj7roVGdvl+m0NgwsZc1Pge8Gtuii2jMfvpygL5E9O2bKVyDQ4revWYzmdIJ8O370lzzM3hTN55m/cJZm27bKAID+/gz8fBcs+R6bj9ofEa1oj1LgDObFz6XSRuQde/6wSx2WBSSum917zZpaaT//nFPUO/hn5/TFw8ceKFeuf6QPjVXJyDJSn4QAAAABJRU5ErkJggg==",
                    "2019年高考理科数学（全国Ⅰ卷）试题-HTML.004.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAUCAYAAAAXxsqQAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB50lEQVR4nO1XMUgDQRBcUliJYCEhiNh/ZSNWwcZCgojYim0QEREJSAhWYmNhaSdWNmIlIoJYpRBbCxEbESsbK5EQhLjL3eMR7n737glBcwMD/383u/vz9/v3ABERERFWbCDfAnSdHDnHkO859L0G1XeBbGvOg/JoUxpgHXmILAYkz2PsdU59r1FHTuhjMpXMJY+OkFuSAJ85kocaQ29IPUCfIK8Cc/rGLBjHQ8gH4/xLEth2cx3NFR30FPki1HJIdDwf/TjyBHmHnHHUIanXJ2aKaeQestSVj0XbcT3RSWnZjzrm+BpLN32GHBbqR5D7oFbLIjNXUq9vzFVd4yuybFz/ZnRQQd5kjH8gpzLGfY1tICeF+m3kI6i2UciYZ4KrNyQmgXpsyzhvAvNQ6MZmHWO0uuhJVRh997mLWeM27CCfQa1AiQmSen1jmjDrLAOzqMj1pmNsDlRv2RUmCwGnp1f6ANQqW2bmSur1jWnCrPUWucAJXD2WTF9CniNrgmQhkOpp23MM2R8aSb2+MVOk260UbI8l2G7uCdRXkxo9PdmGh9YHIdutS8t1ab0+Me/ht1WRqWaLEdXdj33sX4fIM/rzor+JEjfRgkEzNv3zWpMKqsBvqG1o8VP+Fcijar+LiIiIiBhE/ACd0YY1dOdvOAAAAABJRU5ErkJggg==",
                    "2019年高考理科数学（全国Ⅰ卷）试题-HTML.005.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAUCAYAAADr0+FaAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB8klEQVR4nO2XP0hDMRDGjw5OInQQERH3IuLmJCI4iYi4irgVERERQaSIg7g4dHQrTiKIo0hBnDq4O4h0EXFycRKRItTvSCvt8+XdJU95g/nBB22Su1wuf15CFAgEApmzDj172DVT9NkPvaSwz5o8VIUa0A2Z8TCcxw2tkzWoDA14BJAm+dWU9lmzD41BOegIumiVcx6PoU2Nk7cUAfgmj3farod9Abry7PO3fS51/O6DPiL17xoncQlotsQd9ECn0KPSVqLQ8udiPwSdQLfQhCUOTbwuPl15jYlJpGEp5yRxYLx98pY2rsnnxJxDvUp7XlGH0B00L7TVxOvqUwv3V46UfUpGs9B1Qj3P5nhCvWvyS9CI0n4LuidzROWU/qV4fXxqWKbucTE1EiaXBz9lqeNV+kRmgpLso/9tSqqPYweqk1nJmkRp4tX6lMbRCftZiSmftLT/hmemZqmbgQ6gPSHINEj2vJ35JsGrdVFoq4nX1aeGaUs5Xz/nJGPbmc8Ts0DmCrVtafPXyW8zDFUo+eOoidfVp0T7ej5K5uPdiXjmM3EJeCBzG+CPE6+QkoOtCz5XzcuYcm28Lj4lzqj7OKpE6lVjy+Ke/x9Q5ZVfuPwiG/ToICT/J+0X7qrWoEjyoySO6KsuYPJYzDqIQCAQCGTPF1zIiUyolmYgAAAAAElFTkSuQmCC",
                    "2019年高考理科数学（全国Ⅰ卷）试题-HTML.006.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAAAUCAYAAAD4BKGuAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB10lEQVR4nO1XMUgDQRBcUlgKKURExD6I2FmJCFYiIrYidkFERESwELEQG4uUdsFKbCxFBLFKYW8hYiNibyUiQYizXAIafm/37uGFeAMDyd/t/Pzc/d8dUUJCQoKKDfA1oq4VUVMGr8EmeAsORGgUAckn57RpFVkHa+BghIGYcA/AcbAEHoMXERpFQPLJOZ2AWxaR9xwGYsJd/vG7H/wMqK2AVxH3jNHUfH5YxLMCarXJN+gDz8BnY20o3gx9hsFT8A6cFHxY/IZoaj5Nz94UrlfaN+bpXxb65A2XdWuedp4xR+A9uKBoWfyGavp8fmlFc+CNp51Ha8LTnjfcFXBUaNsGH8gttiWjnuY3RpOR5bNByuBwONNCG79eL+QGwFff/V9iN/jhVj3au+ATuZloCcLiN1STSPY5Rcrk4uQbQtsseAjue+rzzNwZQx9+HXml5tm2pPS1+A3VZEg+eXs2rxVL31wOfpHcFmRH6BMbbmfbN0ZuUdEwAtbJv/hY/IZq+nyq31xGVkCP5FZT/vjzCO8F1Go4p9+fi3pALS9alxnXrX5DNDWfpmcvep/bKzDlxic0PnEMRdzgP4bbOaGtWQuqpG+6sxByuuoVcE7VvzaRkJCQkED0DaPXfUo3NuuTAAAAAElFTkSuQmCC",
                    "2019年高考理科数学（全国Ⅰ卷）试题-HTML.007.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAXCAYAAABK6RIcAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACCUlEQVR4nO1XMUgDQRBcUlgKKURExD6I2IhVEMFCgojYBrETERERQUTEQmwsUtoFK7GxEhFBrFKIrYWIjYi9lYgEIe549/g+f3f7B4kk3sDA8Xu3uzd/v7dPFBAQ8E/R+OsE2hlBPI0V5kvGNTbx8sxLZp15zezxzKuZQE5npHIEp/Rz6LAqdbLMrDB7Mwa3ibfLHGbmmAfM04y+W4Et5oAeQ7i6HkOHQ+aaxMmbZ3CbeOXYuJv5kcFvgXnhlVE2n7nYuIt5l7C/SxynidDQLGvHx8wnwToTXgVz+plHzBvmmEc+WX1GGGXuMftSYjpRNzwv6KA4vvkUu1Q8rK1Y7DiZ+6Te/IxlnisfH5/zpPbxzCwmbJ+OGFRiXlnsODEjBptUPCQ4aLCtM+9JXVg5wxxpPr4+AdS8ZGmpkV34bwHGDTZ8HngjJctaF5D8gsW+yXwkdZpcG3Xl4+MzjuR+iinPfgHK1gy2SVK1YEcYLA0Tgjn4BHEj47TMWea58vHxGUdyP2ixpl2LTDUPws6SajM2BMGSiFqfIVJF2wW0DVUyF3dXPj4+I8RblQjOmgekifBA6qZC4cXb2xaui3BCPzckWJUkooGL4dwjn6w+b2P5QbhkORDV9Gb0eZ0AkS74w0BHnexzXOhU8aI/jCXpgkWSNZ1xdKp40GGx2UE6VbyWIIgXEBDQDvgCo2t+Nv4wDocAAAAASUVORK5CYII="
                }
            }
        }
    },
    methods: {
        Get_Question_Type(Type){
            if(Type == 'SingleChoice'){
                return "选择题"
            }
        },
        Get_Question_Show(Stem, Type){
            for(var key in this.TestData.img){
                var Img_Name_Catcher = new RegExp('<IMG: ' + key + '>')
                if(Img_Name_Catcher.exec(Stem) != null){
                    Stem = Stem.replace(Img_Name_Catcher,'<img src="' + this.TestData.img[key] + '">')
                }
            }

            if(Type == 'stem'){
                return "题干：" + Stem
            }else if(Type == 'answer'){
                return "答案：" + Stem
            }else if(Type == 'analyse'){
                return "解析：" + Stem
            }
        },
        Get_Question_Options(Stem, Index){
            for(var key in this.TestData.img){
                var Img_Name_Catcher = new RegExp('<IMG: ' + key + '>')
                if(Img_Name_Catcher.exec(Stem) != null){
                    Stem = Stem.replace(Img_Name_Catcher,'<img src="' + this.TestData.img[key] + '">')
                }
            }
            return String.fromCharCode(Index + 65) + "：" + Stem
        },
    }
}
</script>