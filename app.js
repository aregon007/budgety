//budget control module
//IIFE function :imediatly invoked function expresion

const budgetController=(function(){
//data structure for expanse function prototype :are similar to classes we can then create variable with new keyword
    var Expanse=function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage=-1;
    }
    Expanse.prototype.calculatePercentage=function(income){
        if(income>0){
                this.percentage=Math.round((this.value/income)*100);
    
            }
            else{
                this.percentage=-1;
            }
    }

    Expanse.prototype.getPercentage=function(){
        return this.percentage;
    }


    
//income
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
//all the collection
    var data={
        allItems:{
            exp:[],
            inc:[]
        },
        total:{
            exp:0,
            inc:0
        },
//-1 implies non existence of particular variable
        percentage:-1,
        totalBudget:0
    }
    var totalSum=function(type){
        var sum=0;
        data.allItems[type].forEach(cal=>{
            sum=sum+cal.value;
        })
        data.total[type]=sum;
    }
   
    

    return{
        addItem:function(type,value,description){
            var newItem,ID;
            if(data.allItems[type].length >0){
                ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }else{
                ID=0;
            }

            if(type==='exp'){
                newItem=new Expanse(ID,description,value);

            }else if(type==='inc'){
                newItem=new Income(ID,description,value);
                
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        test:function(){
            return data;
        },
      
        calculateBudget:function(){
            //calculte total exp and income
            totalSum("exp");
            totalSum("inc");
            //calculate total budget
            data.totalBudget=data.total.inc-data.total.exp;
            //calculte percentage
            if(data.total.inc>0){
                data.percentage=Math.round((data.total.exp/data.total.inc)*100);

            }

        },
        calculatePercentage:function(){
            data.allItems.exp.map(function(ele){
                ele.calculatePercentage(data.total.inc);
            })            
        },
        getPercentage:function(){
            var arr=data.allItems.exp.map(function(cur){
                
                 return cur.getPercentage()
            })
            console.log(arr)
            
            return arr;
        },
        getBudget:function(){
            return{
                budegt:data.totalBudget,
                income:data.total.inc,
                expanse:data.total.exp,
                percentage:data.percentage
            }
        },
        deleteData:function(type,id){
            var index;
            data.allItems[type].map(function(item,i){
                    if(item.id===id){
                        index=i;

                    }
                    
            })
            data.allItems[type].splice(index,1);
            

        }
    }
  
})();

var UIController=(function(){
    var domElement={
        inputType:".add__type",
        inputValue:".add__value",
        inputDescription:".add__description",
        inputAddbtn:".add__btn",
        incomeContainer:".income__list",
        expanceContainer:".expenses__list",
        budgetValue:".budget__value",
        incomeValue:".budget__income--value",
        expanseValue:".budget__expenses--value",
        expansePercent:".budget__expenses--percentage",
        listContainer:".container",
        percentgeLabel:".item__percentage",
        monthLabel:".budget__title--month"
    }
    var nodeListForEach=function(list,callback){
        for(i=0;i<list.length;i++){
            callback(list[i],i)
        }
    }

    return{
        getMOnth:function(){
            var date,month,year;
            date =new Date();
            year=date.getUTCFullYear();
            month=date.getMonth();
            var months=["january","february","march","april","may","june","july","august","september","october","november","december"]
            document.querySelector(domElement.monthLabel).textContent="  "+months[month]+" "+year;
        },
        getInput:function(){
            return{
                    type:document.querySelector(domElement.inputType).value,
                    value:parseFloat(document.querySelector(domElement.inputValue).value),
                   description:document.querySelector(domElement.inputDescription).value
                }
            },
        getDomElement:function(){
            return domElement;
        },

        addList:function(type,item){
          var html,newHtml,element;
          if(type==='inc'){
              element=domElement.incomeContainer;
              

              html=  '<div class="item clearfix" id="inc-%ID%"><div class="item__description">%Description%</div><div class="right clearfix"><div class="item__value">+ %Value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
          }
          else if(type==='exp'){
              
              element=domElement.expanceContainer;
              html='   <div class="item clearfix" id="exp-%ID%"><div class="item__description">%Description%</div><div class="right clearfix"><div class="item__value">- %Value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
          }
          newHtml=html.replace('%ID%',item.id);
          newHtml=newHtml.replace('%Description%',item.description);
          newHtml=newHtml.replace('%Value%',item.value);
          document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },
        clearFields:function(){
            var fields,fieldsArray;
            fields=document.querySelectorAll(domElement.inputDescription+","+domElement.inputValue);
            fieldsArray= Array.prototype.slice.call(fields);
            fieldsArray.forEach(element => {
                element.value="";
            });
            fieldsArray[0].focus();
        },
        dispalyBudget:function(obj){
            document.querySelector(domElement.budgetValue).textContent=obj.budegt;
            document.querySelector(domElement.incomeValue).textContent=obj.income;
            document.querySelector(domElement.expanseValue).textContent=obj.expanse;
            if(obj.budegt>0){
            document.querySelector(domElement.expansePercent).textContent=obj.percentage+"%";
            }
            else{
                document.querySelector(domElement.expansePercent).textContent="---"

            }
        },
        removeList:function(id){
            var el;
            el=document.getElementById(id);
            el.parentNode.removeChild(el)

        },
        dispalyPercentage:function(percentage){
            var fields;
            fields=document.querySelectorAll(domElement.percentgeLabel);
           
            nodeListForEach(fields,function(cur,index){
                if(percentage[index]>0){
                cur.textContent=percentage[index]+"%";

                }
                else{
                    cur.textContent="---"
                }

            })
        },
        handleTypeChnage:function(){
            var fields;
            fields= document.querySelectorAll(
                domElement.inputDescription+","
                +domElement.inputValue+","+
                domElement.inputType
            );
            
            nodeListForEach(fields,function(cur){
                cur.classList.toggle("red-focus")
                
            })
            document.querySelector(domElement.inputAddbtn).classList.toggle("red")
            
        }
       

    }

    
})();

var appController=(function(bdgtCnt,uiCnt){
    var input,newItem,obj;
    var totalSum=function(type){
        

    }
    var updateBudget=function(){
        //sum total exp and inc
        bdgtCnt.calculateBudget();
        //return budget
        obj=bdgtCnt.getBudget();

        //dispaly budget in UI
        uiCnt.dispalyBudget(obj);
        
    }
    var updatePercentage=function(){
        //calculate percentage in budget controller
        bdgtCnt.calculatePercentage();

        //getpercentage from budget controller
        var arr=bdgtCnt.getPercentage();
        console.log(arr);
        //display percentage on UI
        uiCnt.dispalyPercentage(arr);
    }
    var addControl=function(){
        // get the input 
        input =uiCnt.getInput();
        if(input.description!=""&& !isNaN(input.value)&&input.value>0){

        //add data to budget cntroller
        newItem= bdgtCnt.addItem(input.type,input.value,input.description)
        //add item to the UI
        uiCnt.addList(input.type,newItem);
        //clear the input fields
        uiCnt.clearFields();
        //update the budget
        updateBudget();
        //update percentage
        updatePercentage();

        }
    }
    var setUpEventListner=function(){
        document.querySelector(uiCnt.getDomElement().inputAddbtn).addEventListener("click",addControl)

        document.addEventListener("keypress",function(event){
            if(event.keyCode==13){
                addControl();
            }
        })
        document.querySelector(uiCnt.getDomElement().listContainer).addEventListener("click",deleteHandeler);
        document.querySelector(uiCnt.getDomElement().inputType).addEventListener("change",uiCnt.handleTypeChnage)
    }
    var deleteHandeler=function(event){
        var fieldId,splitid,id,type;
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        fieldId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(fieldId){
            splitid=fieldId.split("-");
            console.log(splitid);
            type=splitid[0];
            id=parseInt(splitid[1]);
        }
        bdgtCnt.deleteData(type,id);
        //remove from ui
        uiCnt.removeList(fieldId);
        //update budget
        updateBudget();

        //update percentage
        updatePercentage();



    }
 
   
    return{
        init:function(){
            console.log("application started");
            uiCnt.getMOnth();
            setUpEventListner();
           


        }
    }
})(budgetController,UIController);

appController.init();