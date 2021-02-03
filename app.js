const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var fs = require('fs');
const axios = require('axios');
const util = require('util');


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
                                            
        console.log("Entered app.post for templates");
        var url = require('url');
        var address =  req.url;
        var q = url.parse(address, true);
        var qdata = q.query; // returns an object: { type: page, action: 'update',id='5221' }
        //returns 'page'
        var assetType = qdata.assetType;
        console.log("yeh hai asset type" + assetType); 
        var array = [];
        var map={};
        // get access token and fetch all the templates through post api
        var acesstoken= await getacesstoken(clientidSource,clientsecretSource,granttypeSource,accountidSource); 
        
        var request = require('request');
        request.post({
        headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + acesstoken},
        url:     'https://mc6vgk-sxj9p08pqwxqz9hw9-4my.rest.marketingcloudapis.com//asset/v1/content/assets/query',
        body:    
          {
           "query":
            {
             "property":"assetType.name",
              "simpleOperator":"equal",
              "value":assetType
            }, 
          },
         json: true
         }, 
         function(error, response, body)
          {
            console.log("yeh aagaya hai email fetch ke response me");
            //  console.log("yeh response body hai :" +JSON.stringify(response.body));                            
            myobject=  response.body.items; 
            array.push(assetType);  
            for(var attributename in myobject)
              { 
                console.log("yeh hai display name" + myobject[attributename].assetType.displayName);
                if(myobject[attributename].assetType.displayName =='Template-Based Email' || 'Text Only Email' || 'HTML Email')
                  {          
                    var emailName=myobject[attributename].name;
                    console.log("Yeh Email name hai");
                  //  emailName = path.parse(emailName).name;
                  console.log("yeh email ki id hai" + myobject[attributename].id) ;
                    map[myobject[attributename].id] = myobject[attributename].name;
                    var asset='email';
                  }
                else if(myobject[attributename].assetType.displayName =='Template')
                  {
                    console.log("temmmmmmmmmmmmmm ke andar");
                    var templateName = myobject[attributename].name;
                    console.log(templateName)
                    var slotsJSON = myobject[attributename].slots;
                    var contentJSON = myobject[attributename].content;
                    var assetId = myobject[attributename].assetType.id;
                    // Made JSON to store template items
                    var templateJSON = 
                      {
                        name : {templateName},
                        content : {contentJSON},
                        slots: {slotsJSON}, 
                        assetId: {assetId}      
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
            console.log("MAP : " + JSON.stringify(map));
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
  var assetType = qdata.assetType; // Fetching assetType from the passed url from the client

  console.log("This is request body ----> " + JSON.stringify(reqYes.body));  
        
  images=reqYes.body;
  console.log("yeh images ka first element id" + images.id);
  console.log("yeh images ka first element value" + images.value);
      
  if(button=='Yes')
    {
      resYes.redirect("FourthPage.ejs"); 
    } 
                    
app.post("/call", async (reqCall,resCall)=>
  { 
    console.log("yeh hai reqcall" + reqCall);
    var accesstoken= await getacesstoken(clientidSource,clientsecretSource,granttypeSource,accountidSource); 
    var access_tokenDestination= await getacesstoken(clientIdDestination,clientSecretDestination,grantTypeDestination,accountIdDestination);
    console.log("yeh destination access token hai " + access_tokenDestination );
    var templateIdArray = [];
    for(var myobject in images)
      {
        templateIdArray.push(myobject); // Putting Id of all the selected templates in template array
      }
    console.log("This is template Array ----> " + templateIdArray);

    // Fetching all the templates in an org
    var request = require('request');
    request.post({
    headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + accesstoken},
    url:     'https://mc6vgk-sxj9p08pqwxqz9hw9-4my.rest.marketingcloudapis.com//asset/v1/content/assets/query',
    body:    {
              "query":
                {
                 "property":"assetType.name",
                 "simpleOperator":"equal",
                 "value":assetType
                },
             },
    json: true
    }, 
      async function(error, response, body)
        {
          myobjectBody=  response.body.items; 
          var acesstoken= await getacesstoken(clientIdDestination,clientSecretDestination,grantTypeDestination,accountIdDestination); 
          
          // iterating over the templates in an org
          for(var attributename in myobjectBody)
            {
              if(myobjectBody[attributename].assetType.displayName =='Template')
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
                        var templateName = myobjectBody[attributename].name;
                        console.log("----> " + templateName);
                        var slotsJSON = myobjectBody[attributename].slots;
                        var contentJSON = myobjectBody[attributename].content;
                        var assetTypeID = myobjectBody[attributename].assetType.id;
 
                        if(acesstoken!=null)
                          {
                            // invoked method to insert the template in destination org
                            var imageinsert=await getimageinserted(templateName,contentJSON,slotsJSON,access_tokenDestination,assetTypeID);       
                            console.log("yeh imageinsert.message" + imageinsert.message);
                            if(imageinsert.message=='Failed')
                              {
                                var dataToWrite=
                                  {
                                    "imagename":templateName,
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
                                "imagename":templateName,
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
async function getimageinserted(templateName,templateContent,templateSlots,acesstoken,assetTypeID)
  {
    console.log("Inside Image Insert ");
    console.log("template name ---> " + templateName);
    console.log("acess token---> " + acesstoken);
    console.log("assetTypeID ---> " + assetTypeID);
 
    var  data=
      {
        "name": templateName,
        "content": templateContent,
        "slots" : templateSlots,
        "assetType": 
          {
            "name": "template",
            "id": assetTypeID
          },
      }
  
    var headers = 
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json','Authorization': 'Bearer ' + acesstoken }
      }
  console.log("Headers"+headers);
  var req;
   try{
    return new Promise(function (resolve, reject) {
      req=axios.post('https://mc6vgk-sxj9p08pqwxqz9hw9-4my.rest.marketingcloudapis.com/asset/v1/content/assets',data,headers)
      .then(
        (response)=>
        {
            console.log("yeh response hai insert ke baad" + response);
          //    console.log(response.data);
              console.log("Processing Image Insertion" );
            //  var sucess="sucess";
             // var res=response.data;
              var data=
              {
                message:"success",
                res:response.data,
                status:response.statusCode,
                hi:"hii"
              }
              resolve(data);
        },
        (error)=>
        {
         // reject(error);
          console.log("Err-------------->"+error);
          //var err="error";
         // var errres=error.data;
          var data=
          {
            message:"Failed",
            errres:error.data,
            status:error.ErrorCode,
            hi:"hii"
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