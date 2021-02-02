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
            //  console.log("yeh response body hai :" +JSON.stringify(response.body));                            
            myobject=  response.body.items; 
            array.push(assetType);  
            for(var attributename in myobject)
              { 
                if(myobject[attributename].assetType.displayName =='Image')
                  {          
                    var onlyimageName=myobject[attributename].name;
                    onlyimageName = path.parse(onlyimageName).name;
                    map[myobject[attributename].name] = myobject[attributename].fileProperties.publishedURL;
                    var asset='image';
                  }
                else if(myobject[attributename].assetType.displayName =='Template')
                  {
                    var templateName = myobject[attributename].name;
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

try{
      return new Promise(function (resolve, reject) {
         axios.post('https://mc6vgk-sxj9p08pqwxqz9hw9-4my.auth.marketingcloudapis.com/v2/token',
         {
          'client_id': ClientIdDestination,
          'client_secret': ClientSecretDestination,
          'grant_type': GrantTypeDestination,
          'account_id':  AccountIdDestination
         })
         .then( 
               (     response) => { 
         // console.log(response);
                    var result = response.data; 
        //            console.log("Result"+result.access_token);
        //            console.log('Processing acess token'); 
                    resolve(result.access_token); 
                            }, 
                    (error) => { 
                    reject(error); 
                            } 
             )                    

         });
     
  }
catch(err){}    
}
//get base 64 of image
/*
async function getbase64(imageURL)

{
  var request =  require('request').defaults({ encoding: null });
  try{
    return new Promise(function (resolve, reject) {
      return axios
      .get(imageURL, {
        responseType: 'arraybuffer'
      })
      .then(
        (response) => { 
        var base64enc=Buffer.from(response.data, 'binary').toString('base64');
        //console.log("Bse64enc"+base64enc);
        resolve(base64enc);
                      }, 
          (error) => { 
          reject(error); 
                    } 
           )
       });
    }

catch(err){
      console.log("Error"+err);
    }
      
}
*/
//image inserte
async function getimageinserted(templateName,templateContent,templateSlots,acesstoken,assetTypeID)
{
 // console.log("Imgeurl"+imageURL);
 // console.log(imageName);
 // var ext = path.extname(imageURL);
 // var assetType = ext.substring(1);
 // console.log(ext);
 // var assetTypes = { ai: 16, psd: 17, pdd: 18, eps: 19, gif: 20, jpe: 21, jpeg: 22, jpg: 23, jp2: 24, jpx: 25, pict: 26, pct: 27, png: 28, tif: 29, tiff: 30, tga: 31, bmp: 32, wmf: 33, vsd: 34, pnm: 35, pgm: 36, pbm: 37, ppm: 38, svg: 39, "3fr": 40, ari: 41, arw: 42, bay: 43, cap: 44, crw: 45, cr2: 46, dcr: 47, dcs: 48, dng: 49, drf: 50, eip: 51, erf: 52, fff: 53, iiq: 54, k25: 55, kdc: 56, mef: 57, mos: 58, mrw: 59, nef: 60, nrw: 61, orf: 62, pef: 63, ptx: 64, pxn: 65, raf: 66, raw: 67, rw2: 68, rwl: 69, rwz: 70, srf: 71, sr2: 72, srw: 73, x3f: 74, "3gp": 75, "3gpp": 76, "3g2": 77, "3gp2": 78, asf: 79, avi: 80, m2ts: 81, mts: 82, dif: 83, dv: 84, mkv: 85, mpg: 86, f4v: 87, flv: 88, mjpg: 89, mjpeg: 90, mxf: 91, mpeg: 92, mp4: 93, m4v: 94, mp4v: 95, mov: 96, swf: 97, wmv: 98, rm: 99, ogv: 100, indd: 101, indt: 102, incx: 103, wwcx: 104, doc: 105, docx: 106, dot: 107, dotx: 108, mdb: 109, mpp: 110, ics: 111, xls: 112, xlsx: 113, xlk: 114, xlsm: 115, xlt: 116, xltm: 117, csv: 118, tsv: 119, tab: 120, pps: 121, ppsx: 122, ppt: 123, pptx: 124, pot: 125, thmx: 126, pdf: 127, ps: 128, qxd: 129, rtf: 130, sxc: 131, sxi: 132, sxw: 133, odt: 134, ods: 135, ots: 136, odp: 137, otp: 138, epub: 139, dvi: 140, key: 141, keynote: 142, pez: 143, aac: 144, m4a: 145, au: 146, aif: 147, aiff: 148, aifc: 149, mp3: 150, wav: 151, wma: 152, midi: 153, oga: 154, ogg: 155, ra: 156, vox: 157, voc: 158, "7z": 159, arj: 160, bz2: 161, cab: 162, gz: 163, gzip: 164, iso: 165, lha: 166, sit: 167, tgz: 168, jar: 169, rar: 170, tar: 171, zip: 172, gpg: 173, htm: 174, html: 175, xhtml: 176, xht: 177, css: 178, less: 179, sass: 180, js: 181, json: 182, atom: 183, rss: 184, xml: 185, xsl: 186, xslt: 187, md: 188, markdown: 189, as: 190, fla: 191, eml: 192, text: 193, txt: 194, freeformblock: 195, textblock: 196, htmlblock: 197, textplusimageblock: 198, imageblock: 199, abtestblock: 200, dynamicblock: 201, stylingblock: 202, einsteincontentblock: 203, webpage: 205, webtemplate: 206, templatebasedemail: 207, htmlemail: 208, textonlyemail: 209, socialshareblock: 210, socialfollowblock: 211, buttonblock: 212, layoutblock: 213, defaulttemplate: 214, smartcaptureblock: 215, smartcaptureformfieldblock: 216, smartcapturesubmitoptionsblock: 217, slotpropertiesblock: 218, externalcontentblock: 219, codesnippetblock: 220, rssfeedblock: 221, formstylingblock: 222, referenceblock: 223, imagecarouselblock: 224, customblock: 225, liveimageblock: 226, livesettingblock: 227, contentmap: 228, jsonmessage: 230 };
 // var assetTypeID = assetTypes[assetType];
  //console.log(assetType);
 // console.log(assetTypeID);
 //console.log("acesstokeninimageinserted"+acesstoken);
  console.log("Image Insert ke functon ke andar aagya hai bhaisahab");
  console.log("template name ---> " + templateName);
 // console.log("template content ---> " + templateContent);
 // console.log("template slots ---> " + templateSlots);
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