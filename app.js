const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var fs = require('fs');
const axios = require('axios');
const util = require('util');
let xmlParser = require('xml2json');



const app = express();
var images;

// This will make our form data much more useful
//app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

// This will set express to render our views folder, then to render the files as normal html
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, './views')));

// Future Code Goes Here
app.get('/', (req, res) => {
  res.render('index');
  //res.send('An alligator approaches!');
});

  //---------------------------------------------------------SecondPage-Images------------------------------------------------------------------------------------
app.post("/accesstoken", async (req, res) => {
  //---------------------------------------------------------Get Access Token------------------------------------------------------------------------------------
       console.log(req.body);
     //   console.log("near");
     //   console.log(req);
        const clientidSource = req.body.ClientIdSource;
        const clientsecretSource = req.body.ClientSecretSource;
        const granttypeSource = req.body.GrantTypeSource;
        const accountidSource = req.body.AccountIdSource;
        const clientIdDestination = req.body.ClientIdDestination;
        const clientSecretDestination = req.body.ClientSecretDestination;
        const grantTypeDestination = req.body.GrantTypeDestination;
        const accountIdDestination = req.body.AccountIdDestination;


        var access_token= await getacesstoken(clientidSource,clientsecretSource,granttypeSource,accountidSource);
        var access_tokenDestination= await getacesstoken(clientIdDestination,clientSecretDestination,grantTypeDestination,accountIdDestination);
        
        
        if(access_token!= undefined && access_tokenDestination!=undefined)
        
        {
            var array=[];
            res.render("SecondPage.ejs",{data:array});
 
        }
        else
        {
            res.render("index.ejs");
            console.log("index");
        }
        
        //---------------------------------------------------------SecondPage-Images------------------------------------------------------------------------------------
app.post("/asset", async (req, res) => {
                                            
        console.log("Entered app.post for Query");
        var url = require('url');
        var address =  req.url;
        var q = url.parse(address, true);
        var qdata = q.query; // returns an object: { type: page, action: 'update',id='5221' }
        //returns 'page'
        var assetType = qdata.assetType;
        console.log("yeh hai asset type : " + assetType);

        var array = [];
        var map={};
        // get access token and fetch all the templates through post api
        var acesstoken= await getacesstoken(clientidSource,clientsecretSource,granttypeSource,accountidSource); 
        
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + acesstoken},
        url:     'https://mc6vgk-sxj9p08pqwxqz9hw9-4my.rest.marketingcloudapis.com//automation/v1/queries/',
        body:    
        {
        },
         json: true
         }, 
         function(error, response, body)
          {
            console.log("RESPONSE " + JSON.stringify(response));
            console.log("QUERY ERROR --->  " + error);
            console.log("yeh aagaya hai query fetch ke response me");
            //  console.log("yeh response body hai :" +JSON.stringify(response.body));                            
            myobject=  response.body.items; 
            console.log(JSON.stringify(myobject));
           //  array.push(assetType);  
            

           //  var assetTypeDisplayNameArray = ["Smart Capture","Layout","Free Form Block", "Text Block", "Dynamic Block", "Image Carousel Block","Social Follow Block", "Social Share Block", "External Content Block","Code Snippet Block","Enhanced Dynamic Content Block","Button Block","Image Block","HTML Block"];
            for(var attributename in myobject)
              { 
                console.log("yeh hai display name" + myobject[attributename].name);
                console.log("yeh hai display name" + myobject[attributename].key);
              //  console.log(assetTypeDisplayNameArray.includes(myobject[attributename].assetType.displayName));
                if(assetType = 'query')
                  {       
                    var queryJSON = {
                      queryDefinitionId : myobject[attributename].queryDefinitionId,
                      name : myobject[attributename].name,
                      key : myobject[attributename].key,
                      description : myobject[attributename].description,
                      queryText : myobject[attributename].queryText,
                      targetName : myobject[attributename].targetName,
                      targetKey : myobject[attributename].targetKey,
                      targetId : myobject[attributename].targetId,
                      targetDescription : myobject[attributename].targetDescription,
                      targetUpdateTypeId : myobject[attributename].targetUpdateTypeId,
                      targetUpdateTypeName : myobject[attributename].targetUpdateTypeName,
                      categoryId : myobject[attributename].categoryId,
                      isFrozen : myobject[attributename].isFrozen

                    };
                    
                    console.log("Yeh hai queryDefinitionId" + myobject[attributename].queryDefinitionId);
                    console.log("Yeh hai description" + myobject[attributename].description);
                    console.log("Yeh hai queryText" + myobject[attributename].queryText);
                    console.log("Yeh hai targetName" + myobject[attributename].targetName);
                    console.log("Yeh hai targetKey" + myobject[attributename].targetKey);
                    console.log("Yeh hai targetId" + myobject[attributename].targetId);
                    console.log("Yeh hai targetDescription" + myobject[attributename].targetDescription);
                    console.log("Yeh hai targetUpdateTypeId" + myobject[attributename].targetUpdateTypeId);
                    console.log("Yeh hai targetUpdateTypeName" + myobject[attributename].targetUpdateTypeName);
                    console.log("Yeh hai categoryId" + myobject[attributename].categoryId);
                    console.log("Yeh hai isFrozen" + myobject[attributename].isFrozen);

                   
                    console.log("Loop me aagya query wala ");
             
                    console.log("yeh query ka name hai : " + queryJSON) ;
                    map[myobject[attributename].key] = queryJSON;
                    
                    var asset ='query' ;
                    
                  }
                else if(myobject[attributename].assetType.displayName =='Template')
                  {
                    console.log("temmmmmmmmmmmmmm ke andar");
                    var templateName = myobject[attributename].name;
                    console.log(templateName);
                    var slotsJSON = myobject[attributename].slots;
                    var contentJSON = myobject[attributename].content;
                    var assetId = myobject[attributename].assetType.id;
                    // Made JSON to store template items
                    var templateJSON = 
                      {
                        name : {templateName},
                        content : {contentJSON},
                        slots: {slotsJSON}, 
                        assetI: {assetId}      
                      } 
		    var asset='template';

                    map[myobject[attributename].id] = templateJSON.name.templateName;
                  }
                else if(assetType=='email')
                  {
                    array.push(myobject[attributename].name);
                  }
                else if(assetType=='audio')
                  {
                    array.push(myobject[attributename].fileProperties.publishedURL);
                  }
              }
          //  console.log("MAP : " + JSON.stringify(map));
            // Returned map and assetType as a response to the client
            res.json({map:map,assetType:asset});

      });
});

        //---------------------------------------------------------SecondPage-Images------------------------------------------------------------------------------------
        //---------------------------------------------------------Get source Access Token------------------------------------------------------------------------------------

app.post("/convertintobase64", (reqYes, resYes) => {

  var url = require('url');
  var address =  reqYes.url;
  var q = url.parse(address, true);
  var qdata = q.query; // returns an object: { type: page, action: 'update',id='5221' }
  var button=qdata.button;

  console.log("This is request body ----> " + JSON.stringify(reqYes.body));  
        
  images=reqYes.body;
 
  console.log("yeh images hai "  + JSON.stringify(images));
      
  if(button=='Yes')
    {
      resYes.redirect("FourthPage.ejs"); 
    } 
                    
app.post("/call", async (reqCall,resCall)=>
  { 
    console.log("yeh aagya call wale method me");
 //   console.log("yeh hai reqcall" + reqCall);
    var accesstoken= await getacesstoken(clientidSource,clientsecretSource,granttypeSource,accountidSource); 
    var access_tokenDestination= await getacesstoken(clientIdDestination,clientSecretDestination,grantTypeDestination,accountIdDestination);
    console.log("yeh destination access token hai " + access_tokenDestination );
    var templateIdArray = [];
    console.log(images);
    console.log(JSON.stringify(images));

    for (const [keyimage, value] of Object.entries(images)) 
    {
      console.log("yeh hai images ka target data extension" + keyimage);
      console.log("This is template Array ----> " + JSON.stringify(value.name));
    //  console.log("This is template  ----> " + JSON.stringify(keyimage.id.name));
      console.log("This is template Array ----> " + JSON.stringify(keyimage));
      console.log("This is template  ----> " + keyimage.name);
    }
  //  console.log("This is template Array ----> " + templateIdArray);

    var request = require('request');
    var options = {
    'method': 'POST',
    'url': 'https://mc6vgk-sxj9p08pqwxqz9hw9-4my.soap.marketingcloudapis.com/Service.asmx',
    'headers': {'content-type' : 'text/xml','Authorization': 'Bearer ' + access_tokenDestination},
    body: '<?xml version="1.0" encoding="UTF-8"?>\r\n<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">\r\n   <s:Header>\r\n      <a:Action s:mustUnderstand="1">Retrieve</a:Action>\r\n      <a:MessageID>urn:uuid:7e0cca04-57bd-4481-864c-6ea8039d2ea0</a:MessageID>\r\n      <a:ReplyTo>\r\n         <a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address>\r\n      </a:ReplyTo>\r\n      <a:To s:mustUnderstand="1">https://mc6vgk-sxj9p08pqwxqz9hw9-4my.soap.marketingcloudapis.com/Service.asmx</a:To>\r\n      <fueloauth xmlns="http://exacttarget.com">' + access_tokenDestination  + '</fueloauth>\r\n   </s:Header>\r\n   <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\r\n      <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">\r\n         <RetrieveRequest>\r\n             <ObjectType>DataExtension</ObjectType>\r\n        <Properties>CustomerKey</Properties>\r\n        <Properties>Name</Properties>\r\n        <Properties>DataExtension.ObjectID</Properties>\r\n        <Properties>DataExtension.CustomerKey</Properties>\r\n        <Properties>IsSendable</Properties>\r\n        <Properties>SendableSubscriberField.Name</Properties>\r\n        <Properties>SendableDataExtensionField.Name</Properties>\r\n        <Properties>CategoryID</Properties>  \r\n        \r\n            </RetrieveRequest>\r\n      </RetrieveRequestMsg>\r\n   </s:Body>\r\n</s:Envelope>'
  
  };
    request(options, async function (error, response) {
    if (error) throw new Error(error);
  //  console.log("yeh hai de ki response body" + response.body);
    SourceListDEResult = response.body ; 
    SourceListDEResult = SourceListDEResult.replace(/:/g, "");
    SourceListDEResult = xmlParser.toJson(SourceListDEResult);
  //  console.log("yeh hai de ki response ki json body" +SourceListDEResult);

  
    SourceListDEResult = JSON.parse(SourceListDEResult);
  
    var ResultList  = SourceListDEResult.soapEnvelope.soapBody.RetrieveResponseMsg.Results;
  //  console.log("yeh hai result list " + JSON.stringify(ResultList)); 
     var targetDEArray = [];
     ResultListMap = {};
     for (var key in ResultList) 
    {
//    console.log("yeh hai target data extension" + ResultList[key].Name)   
      targetDEArray.push(ResultList[key].Name);
      ResultListMap[ResultList[key].Name] = ResultList[key] ; 
         
    }
  //  console.log("RESULTLISTMAP  : "  +  JSON.stringify(ResultListMap));


    for ( key in images )
    {
   
     console.log("images[myobject].targetName  check --->  " + images[key].targetName);
     console.log("images key" + JSON.stringify(images[key])
     );
    // console.log("yeh hai images ki key" + images[ResultList[key].Name]);
    // if ( templateIdArray.includes(ResultList[key].Name) == true )
      if ( targetDEArray.includes(images[key].targetName) == true )
      {
          var name =  images[key].name ; 
          console.log("query ka name : --- >  " + name);
      //  console.log("JSON----> ",JSON.stringify(images[key]));
          var queryKey = images[key].key ; 
          console.log("query ka key : --- >  " + queryKey);
          var description = images[key].description ; 
          console.log("query ka description : --- >  " + description);
      //  console.log("JSON----> ",JSON.stringify(images[key]));
          var queryText = images[key].queryText ; 
          console.log("query ka queryText : --- >  " + queryText);
          var targetName = images[key].targetName ; 
          console.log("query ka targetName : --- >  " + targetName);
          var targetKey = ResultListMap[targetName].CustomerKey ; 
          console.log("query ka targetKey : --- >  " + targetKey);
          var targetId =  ResultListMap[targetName].ObjectID ; 
          console.log("query ka targetId : --- >  " + targetId);
          var targetDescription = images[key].targetDescription ; 
          console.log("query ka targetDescription : --- >  " + targetDescription);
          var targetUpdateTypeId = images[key].targetUpdateTypeId ; 
    //      console.log("query ka targetUpdateTypeId : --- >  " + targetUpdateTypeId);
          var targetUpdateTypeName =images[key].targetUpdateTypeName ; 
    //      console.log("query ka targetUpdateTypeName : --- >  " + targetUpdateTypeName);
          var categoryId =  ResultListMap[targetName].CategoryID ; 
          console.log("query ka categoryId : --- >  " + categoryId);
          

      var queryinsert=await getqueryinserted(name,queryKey,description,queryText,targetName,targetKey,targetId,targetDescription,targetUpdateTypeId,targetUpdateTypeName,categoryId,access_tokenDestination); 
      console.log("yeh query.message" + queryinsert.message);
        
          
            var dataToWrite=
            {
            "queryName":name,
            "message":queryinsert.message,
            "statuscode":queryinsert.status,
            "description":queryinsert.description
            }
        await resCall.write(JSON.stringify({
          dataToWrite            
        }));
        await resCall.write("+");
        console.log("Response Written"); 
  
    }
  
  else 
  {
    var dataToWrite=
    {
    "queryName":images[key].name,
    "message": "Failed" ,
    "statuscode":"400",
    "description":"Target Data Extension does not exist in Destination Org"
    }
  await resCall.write(JSON.stringify({
   dataToWrite            
  }));
  await resCall.write("+");
    console.log("Response Written");

    console.log ("Data Extension is not present in destination org ");

  }
    }
    await resCall.end();
  });

            var countkey = Object.keys(images).length;
            console.log("Size"+countkey);                                
            var progressStatus=(100/countkey);                          
            console.log("status"+progressStatus);
         
        });
                                       
    });
    
});


 //get acesstoken

async function getacesstoken(ClientIdDestination,ClientSecretDestination,GrantTypeDestination,AccountIdDestination)
  {
    try
      {
        return new Promise(function (resolve, reject) {
        axios.post('https://mc6vgk-sxj9p08pqwxqz9hw9-4my.auth.marketingcloudapis.com/v2/token',
          {
            'client_id': ClientIdDestination,
            'client_secret': ClientSecretDestination,
            'grant_type': GrantTypeDestination,
            'account_id':  AccountIdDestination
          })
          .then( (response) => 
            { 
              var result = response.data; 
              // console.log("Result"+result.access_token);
              // console.log('Processing acess token'); 
              resolve(result.access_token); 
            }, 
          (error) => 
            { 
              reject(error); 
            })                    

        }); 
      }
    catch(err){}    
  }


async function getqueryinserted(name,key,description,queryText,targetName,targetKey,targetId,targetDescription,targetUpdateTypeId,targetUpdateTypeName,categoryId,access_tokenDestination)

  {
   
    var  data=
      {
        "name": name ,
        "key":key,
        "description":description,
        "queryText": queryText,
        "targetName":targetName,
        "targetKey":targetKey,
        "targetId": targetId,
        "targetDescription":targetDescription,
        "targetUpdateTypeId":targetUpdateTypeId,
        "targetUpdateTypeName":targetUpdateTypeName,
        "categoryId":10922

      }
  
    var headers = 
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json','Authorization': 'Bearer ' + access_tokenDestination }
      }
  console.log("Headers"+headers);
  var req;
   try{
    return new Promise(function (resolve, reject) {
      req=axios.post('https://mc6vgk-sxj9p08pqwxqz9hw9-4my.rest.marketingcloudapis.com//automation/v1/queries/',data,headers)
      .then(
        (response)=>
        {
      //    console.log(response);
         // console.log(response);
              var data=
              {
                message:"Success",
                res:response.data,
                status:response.status,
                description:'-'
              }
              resolve(data);
        },
        (error)=>
        {
        //  console.log(error);
          var errordescription;
        //  console.log("res "+error.response.data.validationErrors);
        //  console.log("sttaus"+error.response.status);
          var res=error.response.data.errors;
          if(res!=null)
          {
            for (var i in res)
            {
         //     console.log(i);
              console.log(res[i].message);
              errordescription=res[i].message;
            }
          }
          else
          {
            errordescription='-';
          }
          //var err="error";
         // var errres=error.data;
          var data=
          {
            message:"Failed",
            res:error.data,
            status:error.response.status,
            description:errordescription
          }
          resolve(data);
        },

        (body) =>
        {
        //  console.log("Body"+body);

        }
   
      )  
      .catch((error) => {
       // console.log("yeh promise ki Error hai", error);
    })                 
     // console.log("Req"+req) 
  });
 
}

catch(err){
      console.log("Error-->>-->>-->>"+err);

    }              
}
  
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running...'));