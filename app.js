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
    //    var assetTypeAll = qdata.assetTypeAll;
    //    var assetTypeLayout = qdata.assetTypelayout;
    //    var assetTypeSmartcapture = qdata.assetTypesmartcapture;
    //    console.log("yeh hai asset type all : " + assetTypeAll); 
    //    console.log("yeh hai asset type assetTypeLayout : " + assetTypeLayout); 
    //    console.log("yeh hai asset type assetTypeSmartcapture : " + assetTypeSmartcapture); 
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
                  //  var emailName=myobject[attributename].name;
                  //  console.log("Yeh Email name hai");
                  //  emailName = path.parse(emailName).name;
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
//  var assetType = qdata.assetType; // Fetching assetType from the passed url from the client
      //  var assetTypeAll = qdata.assetTypeAll;
      //  var assetTypeLayout = qdata.assetTypelayout;
      //  var assetTypeSmartcapture = qdata.assetTypesmartcapture;
      //  console.log("yeh hai asset type all : " + assetTypeAll); 
      //  console.log("yeh hai asset type assetTypeLayout : " + assetTypeLayout); 
      //  console.log("yeh hai asset type assetTypeSmartcapture : " + assetTypeSmartcapture); 
  console.log("This is request body ----> " + JSON.stringify(reqYes.body));  
        
  images=reqYes.body;
 // var deKey = "BEE63092-0ECA-456C-B4AE-3E042E407C4D";
 // console.log("yeh hai key : " + images[deKey]);
 // console.log("yeh hai key ka target name : " + images[deKey].targetName);
  console.log("yeh images hai "  + JSON.stringify(images));
 // var key = "BEE63092-0ECA-456C-B4AE-3E042E407C4D";
 // console.log("yeh images ka first element value" + images[key].name);
      
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


    for(var myobject in images)
      {
        console.log("images logs");
        console.log("YEH HAI NAME : " + images[myobject].targetKey)
        console.log("YEH HAI obj : " + images[myobject])
        console.log("YEH HAI stringify name : " + JSON.stringify(images[myobject]))
        templateIdArray.push(images[myobject].targetName);
      // console.log(images[myobject].name);// Putting Id of all the selected queries in template array    
      }
      console.log("YEH HAI TEMPLATE ARRAY : " + templateIdArray); 

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
    
  //  console.log("yeh hai de ki response ki json body after : removal --->" +SourceListDEResult);
    SourceListDEResult = JSON.parse(SourceListDEResult);
  //  console.log("yeh hai de ki response ki json body after parse--->" +JSON.stringify(SourceListDEResult));
  //  console.log("yeh hai key --------->" + SourceListDEResult.soapEnvelope.soapBody.RetrieveResponseMsg.Results.CustomerKey);
    var ResultList  = SourceListDEResult.soapEnvelope.soapBody.RetrieveResponseMsg.Results;
    console.log("yeh hai result list " + JSON.stringify(ResultList)); 

    for (var key in ResultList) 
    {
    //  console.log("1. -- " + templateIdArray);
    //  console.log("2. -- " + ResultList[key].Name);
     var QueryKey = ResultList[key].Name;
  //   console.log("IMAGES  STRINGIFY" + JSON.stringify(images));
  //   console.log("IMAGES  with key " + images[QueryKey].queryText);
  //   console.log("IMAGES" + JSON.stringify(images[QueryKey]));
     
    // console.log("yeh hai images ki key" + images[ResultList[key].Name]);
      if ( templateIdArray.includes(ResultList[key].Name) == true )
      {
          var dataKey = '"' + ResultList[key].CustomerKey + '"';
          var QueryKey = ResultList[key].Name;
    //      console.log("this is customer key : " + dataKey);
          var name =  images[QueryKey].name ; 
    //      console.log("query ka name : --- >  " + name);
        //  var key = images[QueryKey].key ; 
        // console.log("query ka key : --- >  " + key);
         var description = images[QueryKey].description ; 
    //     console.log("query ka description : --- >  " + description);
          var queryText = images[QueryKey].queryText ; 
    //      console.log("query ka queryText : --- >  " + queryText);
          var targetName = images[QueryKey].targetName ; 
    //      console.log("query ka targetName : --- >  " + targetName);
          var targetKey = ResultList[key].CustomerKey ; 
          console.log("query ka targetKey : --- >  " + targetKey);
          var targetId = ResultList[key].ObjectID ; 
          console.log("query ka targetId : --- >  " + targetId);
          var targetDescription = images[QueryKey].targetDescription ; 
    //      console.log("query ka targetDescription : --- >  " + targetDescription);
          var targetUpdateTypeId = images[QueryKey].targetUpdateTypeId ; 
    //      console.log("query ka targetUpdateTypeId : --- >  " + targetUpdateTypeId);
          var targetUpdateTypeName =images[QueryKey].targetUpdateTypeName ; 
    //      console.log("query ka targetUpdateTypeName : --- >  " + targetUpdateTypeName);
          var categoryId = ResultList[key].CategoryID ; 
    //      console.log("query ka categoryId : --- >  " + categoryId);
          

     

    //  if(access_tokenDestination!=null)
    //  {
        // invoked method to insert the template in destination org
      //  var imageinsert=await getimageinserted(templateName,contentJSON,slotsJSON,access_tokenDestination,assetTypeID); 
  //  var assetTypedisplayName = myobjectBody[attributename].assetType.displayName;
  //  var imageinsert=await getemailinserted(templateName,views,access_tokenDestination,assetTypeID,assetTypeName,assetTypedisplayName);       
      var queryinsert=await getqueryinserted(name,key,description,queryText,targetName,targetKey,targetId,targetDescription,targetUpdateTypeId,targetUpdateTypeName,categoryId,access_tokenDestination); 
      console.log("yeh query.message" + queryinsert.message);
        if(queryinsert.message=='Failed')
          {
            var dataToWrite=
              {
                "queryname":name,
                "message":queryinsert.message,
                "status code":"400",
                "progressStatus":progressStatus       
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
            "imagename":name,
            "message":queryinsert.message,
            "statuscode":"200",
            "progressStatus":progressStatus
          }
        await  resCall.write(JSON.stringify({
          dataToWrite
        }));
        await resCall.write("+");
        console.log("Response Written");
      }

    }
  
  else
  {
    console.log ("Data Extension is not present in destination org ");

  }
   // await resCall.end();
    }
    await resCall.end();
  });

  
    
  
  
  
  // Fetching all the DE in the Destination org 
  /*  var request = require('request');
        request.post({
        headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + accesstoken},
        url:     'https://mc6vgk-sxj9p08pqwxqz9hw9-4my.rest.marketingcloudapis.com//asset/v1/content/assets/query',
        body:    
        {
          "query":
             {
                 "leftOperand":
                 {
                    "property":"assetType.displayName",
                     "simpleOperator":"equal",
                     "value":assetTypeAll   
                 },
                 "logicalOperator":"OR",
                 "rightOperand":
                 {
                     "leftOperand":
                 {
                    "property":"assetType.name",
                     "simpleOperator":"equal",
                     "value":assetTypeLayout   
                 },
                 "logicalOperator":"OR",
                 "rightOperand":
                 {
                     "property":"assetType.name",
                     "simpleOperator":"equal",
                     "value":assetTypeSmartcapture
                 }
         
                 }
             }
         },
    json: true
    }, 
      async function(error, response, body)
        {
      //    console.log("yeh body hai----------> " + JSON.stringify(body));
          myobjectBody=  response.body.items; 
      //    console.log("YEH HAI RESPONSE BODY BOLE TOH EMAIL --> " + JSON.stringify(myobjectBody));
      //    console.log("YEH HAI RESPONSE BODY BOLE TOH EMAIL withoit stringify --> " + myobjectBody);

          var acesstoken= await getacesstoken(clientIdDestination,clientSecretDestination,grantTypeDestination,accountIdDestination); 
          var assetTypeDisplayNameArray = ["Smart Capture","Layout","Free Form Block", "Text Block", "Dynamic Block", "Image Carousel Block","Social Follow Block", "Social Share Block", "External Content Block","Code Snippet Block","Enhanced Dynamic Content Block","Button Block","Image Block","HTML Block"];
          // iterating over the templates in an org
          for(var attributename in myobjectBody)
            {
              console.log("yeh hai display name" + myobjectBody[attributename].assetType.displayName);
              if(assetTypeDisplayNameArray.includes(myobjectBody[attributename].assetType.displayName)== true)
                {
                  var temp = 0;
                  console.log("yeh myobjectbody ki id : " + myobjectBody[attributename].id);
                  console.log("templateIdArray ki id 1 : " + templateIdArray[0]);
                  console.log("templateIdArray ki id 2 : " + templateIdArray[1]);
                  
                  // checking condition for selected array 
                  while(templateIdArray[temp])
                    {
                      // comparing selected template id and templates present in an org to fetch all its detail
                      if( templateIdArray[temp] == myobjectBody[attributename].id )
                      {
                        console.log( "while if ke andar aagya" + templateIdArray[temp]);
                        console.log( "while if ke andar aagya" + myobjectBody[attributename].id);
                        var contentBlockName = myobjectBody[attributename].name;
                        console.log("Email Name----> " + contentBlockName);
                        var contentBlockContent = myobjectBody[attributename].content;

                        var contentBlockslots= myobjectBody[attributename].slots;
                      //  var views =  myobjectBody[attributename].views;
                      //  var contentJSON = myobjectBody[attributename].content;
                        var assetTypeID = myobjectBody[attributename].assetType.id;
                        var assetTypeName = myobjectBody[attributename].assetType.name;
                        console.log("Yeh hai assetTypeName" + assetTypeName);
                        var assetTypedisplayName = myobjectBody[attributename].assetType.displayName;
 
                        if(acesstoken!=null)
                          {
                            // invoked method to insert the template in destination org
                          //  var imageinsert=await getimageinserted(templateName,contentJSON,slotsJSON,access_tokenDestination,assetTypeID); 
                      //  var assetTypedisplayName = myobjectBody[attributename].assetType.displayName;
                      //  var imageinsert=await getemailinserted(templateName,views,access_tokenDestination,assetTypeID,assetTypeName,assetTypedisplayName);       
                          var imageinsert=await getcontentblockinserted(contentBlockName,contentBlockContent,contentBlockslots,access_tokenDestination,assetTypeID,assetTypeName,assetTypedisplayName); 
                          console.log("yeh imageinsert.message" + imageinsert.message);
                            if(imageinsert.message=='Failed')
                              {
                                var dataToWrite=
                                  {
                                    "imagename":contentBlockName,
                                    "message":imageinsert.message,
                                    "status code":"400",
                                    "progressStatus":progressStatus       
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
                                "imagename":contentBlockName,
                                "message":imageinsert.message,
                                "statuscode":"200",
                                "progressStatus":progressStatus
                              }
                            await  resCall.write(JSON.stringify({
                              dataToWrite
                            }));
                            await resCall.write("+");
                            console.log("Response Written");
                          }
                        }
                        temp++;
                        console.log("yeh temp hai----> " +temp);
                        console.log("status 200");
                        // res.send(200);         
                       }
                       
                       else 
                       {
                         temp++;
                       }
  
                     }      
                   }
                }
            await resCall.end();
            });
           */
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

// method to insert the template
//async function getimageinserted(templateName,templateContent,templateSlots,acesstoken,assetTypeID)
async function getqueryinserted(name,key,description,queryText,targetName,targetKey,targetId,targetDescription,targetUpdateTypeId,targetUpdateTypeName,categoryId,access_tokenDestination)
//async function getemailinserted(templateName,views,acesstoken,assetTypeID,assetTypeName,assetTypedisplayName)
  {
    console.log("Query Insertion wale function me aaya ");
    console.log("query name : --- >  " + name);
    
   console.log("query key : --- >  " + key);
  
   console.log("query description : --- >  " + description);
    
    console.log("query  queryText : --- >  " + queryText);
   
    console.log("query targetName : --- >  " + targetName);
    
    console.log("query  targetKey : --- >  " + targetKey);
    
    console.log("query targetId : --- >  " + targetId);
   
    console.log("query targetDescription : --- >  " + targetDescription);
   
    console.log("query targetUpdateTypeId : --- >  " + targetUpdateTypeId);
  
    console.log("query targetUpdateTypeName : --- >  " + targetUpdateTypeName);
  
    console.log("query  categoryId : --- >  " + categoryId);

    console.log("Yeh destination access token hai " + access_tokenDestination);


   
 
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
          console.log(response);
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
          console.log(error);
          var errordescription;
          console.log("res "+error.response.data.validationErrors);
          console.log("sttaus"+error.response.status);
          var res=error.response.data.errors;
          if(res!=null)
          {
            for (var i in res)
            {
              console.log(i);
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
        console.log("yeh promise ki Error hai", error);
    })                 
      console.log("Req"+req) 
  });
 
}

catch(err){
      console.log("Error-->>-->>-->>"+err);

    }              
}
  
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running...'));