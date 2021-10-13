function Validator(formselector,options= {}){
    
    function getParent(element,selector){
        while (element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var formRules = {

    };
/////////////////////////////////////////////////////////////////////////////
    var validatorRules = {
      required: function(value){
              return value ? undefined : "Vui lòng nhập trường này";
      },
      email: function(value){
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(value) ? undefined : "Trường này phải là email"
},
      min: function(min){
          return function(value) {
                 return value.length > min ? undefined : `Vui lập nhập ít nhất ${min} kí tự `

          }
 },
      max: function(max){
          return function(value){
    return value.length < min ? undefined : `Vui lập nhập nhiều nhất ${max} kí tự `

          }
},
      

        
    }
///////////////////////////////////////////////////////////////////////////
   
    // Lấy ra formElement trong DOM trong formselector
var formElement = document.querySelector(formselector)

// Chỉ xử lí khi có formElement
if(formElement){
   var inputs= formElement.querySelectorAll("[name][rules]")


   for(var input of inputs){
   var rules = input.getAttribute("rules").split("|");
   for(var rule of rules){
       var ruleInfo;
       var isRuleHasValue = rule.includes(":")
       var ruleFunc;
       if(isRuleHasValue){
            ruleInfo = rule.split(':')
            // rule = ruleInfo[0];
            // Vì trong rule return lại một function nên mình sẽ truyền vào tham số để gọi trực tiếp function(value) ra.
            // ruleInfo[0] chính là key để gọi ra function(min)
            ruleFunc = validatorRules[ruleInfo[0]](ruleInfo[1]);

        
        
       }else{
        ruleFunc = validatorRules[rule]
           
       }
    //    var ruleFunc = validatorRules[rule];
    //    if(isRuleHasValue){
    //        ruleFunc = ruleFunc(ruleInfo[1])
    //    }

       

       if(Array.isArray(formRules[input.name])){
                  formRules[input.name].push(ruleFunc)
       } else{
           formRules[input.name]= [ruleFunc];
           
       }
       
   }

    

        // formRules[input.name]=input.getAttribute("rules")

        // Lắng nghe sự kiện onblur.....
        input.onblur = handleValidae;
        input.oninput = handleInput;
    
       
   }
//    console.log(formRules)
   function handleValidae(e){
   var rules = formRules[e.target.name] 
   for (var rule of rules) {
       var errorMessage = rule(e.target.value);
       var groupElement = getParent(e.target,".form-group")
       var errorElement = groupElement.querySelector('.form-message')

      

    //    console.log(errorMessage)
    if(groupElement){
        if(errorMessage){
            //    input.classList.add('invalid')
            groupElement.classList.add('invalid');
            errorElement.innerText = errorMessage;
           }
           else{
            //    input.classList.remove('invalid')
            groupElement.classList.remove('invalid');
            errorElement.innerText = "";
           }
    }
       
        

   }
   return !errorMessage

}

function handleInput(e){
    var groupElement = getParent(e.target,".form-group")
    var errorElement = groupElement.querySelector('.form-message')

    if(groupElement.classList.contains("invalid")){
        groupElement.classList.remove('invalid');
        errorElement.innerText = "";
        
    }
  

}

   
   /////////////////////////////////////////
   
}
// /////////////////////////////////////////////

// Xử lí hanh vi submitform
formElement.onsubmit = function(e) {
    e.preventDefault();

    var inputs= formElement.querySelectorAll("[name][rules]");
    var isValid = true;
   for(var input of inputs){
       if(!handleValidae({
        target: input
    })){
        isValid = false;
    }

       
   }
   console.log(isValid);
   if(isValid){
    //    formElement.submit();
       if(typeof options.onSubmit === 'function'){
        var enableInputs = formElement.querySelectorAll("[name]:not([disabled])")
        var formValues = Array.from(enableInputs).reduce(function(values,input){
            switch(input.type){
                case 'radio':
                    values[input.name]=formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                    break;
                case 'checkbox':
                      if(!input.matches(':checked')) return values
                      if(!Array.isArray(values[input.name])){
                          values[input.name] = []

                      }
                      values[input.name].push(input.value)
                case 'file' :
                   values[input.name] =input.files;
                    break;

                    
                    break;

                default:
                    values[input.name]= input.value
                    
                   

                    

                 

            }
              return  values;
        },{});
           return options.onSubmit(formValues);
       }
       else{
           formElement.submit()
       }

   }

}

}