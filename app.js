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
     //   console.log(req.body);
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
                                            
        console.log("template ke liye aagya app.post me");
        var url = require('url');
        var address =  req.url;
        var q = url.parse(address, true);

        console.log(req);

        var qdata = q.query; // returns an object: { type: page, action: 'update',id='5221' }
        //returns 'page'
        var assetType = qdata.assetType;
        console.log("assetType"+assetType);
         var array = [];
          var map={};
      
        var acesstoken= await getacesstoken(clientidSource,clientsecretSource,granttypeSource,accountidSource); 
        var request = require('request');
         request.post({
         headers: {'content-type' : 'application/json','Authorization': 'Bearer ' + acesstoken},
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
         function(error, response, body){
      //  console.log("yeh response body hai :" +JSON.stringify(response.body));    
      //  console.log(JSON.stringify(response.body.count));
      //  console.log(JSON.stringify(response.body.items)); 
                                                
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
                    //  console.log("YEH SLOT DATA" + JSON.stringify(slotsJSON));
                    //  console.log("String"+JSON.stringify(slotsJSON));
                    //  slotsJSON=JSON.parse(slotsJSON);
                      var contentJSON = myobject[attributename].content;
                      var assetId = myobject[attributename].assetType.id;

                      var templateJSON = {
                        name : {templateName},
                        content : {contentJSON},
                        slots: {slotsJSON}, 
                        assetId: {assetId}      
                    } 
                    //  console.log(templateJSON);
                    var asset='template';
                    console.log("YEH TEMPLATE JSON KA NAME + " +JSON.stringify(templateJSON.name.templateName));
                    
                    //  console.log("yeh hai content" + q);
                      console.log("template wale loop me aaya ");
                      console.log("yeh hai asset id : " + assetId);
                    //  map[myobject[attributename].id] = myobject[attributename].name;
                        map[myobject[attributename].id] = templateJSON;

                     
                  //    console.log("myobject name" + myobject[attributename].fileProperties.name);
                  //     array.push(myobject[attributename].fileProperties.fileName);
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
                                                
        //    console.log("yeh hai map " + JSON.stringify(map));
        //    console.log("array"+array);
  
                                                // res.render("SecondPage.ejs",{data:array});
                                                //     console.log("completed");
            res.json({map:map,assetType:asset});
                                                
                                                //  res.send({"name":"GeeksforGeeks"});

      });
});

        //---------------------------------------------------------SecondPage-Images------------------------------------------------------------------------------------
        //---------------------------------------------------------Get source Access Token------------------------------------------------------------------------------------

       // var images={};

        app.post("/convertintobase64", (reqYes, resYes) => {

        var url = require('url');
        var address =  reqYes.url;
        var q = url.parse(address, true);
        console.log(address);

        console.log("body"+JSON.stringify(reqYes.body));
        var qdata = q.query; // returns an object: { type: page, action: 'update',id='5221' }
        var button=qdata.button;
        console.log(button);
        console.log(reqYes.body);
        
                                                
        var imagemap=qdata.imagemap;
        images=reqYes.body;
      
                        if(button=='Yes')
                        {
        
                        resYes.redirect("FourthPage.ejs"); 
                
                         } 
                    

        
        app.post("/call", async (reqCall,resCall)=>
        {
        // console.log(reqYes.body);
        // console.log("imagses2"+JSON.stringify(images2 ));
        // var images=reqYes.body;
            var countkey = Object.keys(images).length;
            console.log("Size"+countkey);
                                            
            var progressStatus=(100/countkey);                          
            
            console.log("status"+progressStatus);
         
          //  console.log("images"+JSON.stringify(images));
            for(var myobject in images)
            {
            //  console.log(images[myobject]);
            //  console.log(JSON.stringify(images[myobject]));
                
               var imageURL= images[myobject];
                var imageName=myobject;
                console.log("ImageName"+imageName);
                console.log("Template Name--->"+images[myobject].name.templateName);
        //        console.log("Template slots--->"+imageURL.name.templateName);
        //        console.log("Template Name--->"+imageURL.name.templateName);

                console.log("template asset Id ---> " + imageURL.assetId.assetId);
               // var base64=await getbase64(imageURL);
  /*             for(var i in imageURL)
               {
                 console.log("yeh key hai" + i);
             //     console.log("yeh loop lagaya name.templateName" + imageURL[i].name.templateName);
                 console.log("yeh loop lagaya aur name Nikale" + imageURL[i].templateName);
                 //    console.log("yeh loop lagaya aur slots Nikale" + imageURL[i].slotsJSON);
                 //    console.log("yeh loop lagaya aur content Nikala" + imageURL[i].contentJSON);
                 console.log("yeh loop lagaya aur assetId Nikli" + imageURL[i].assetId);
               }
  */
                if(base64!=null)
                {
                    var acesstoken= await getacesstoken(clientIdDestination,clientSecretDestination,grantTypeDestination,accountIdDestination);
                    console.log("Response"+acesstoken);
                    if(acesstoken!=null)
                    {
                    console.log("Before"+acesstoken);
                    var imageinsert=await getimageinserted(imageURL,imageName,acesstoken,base64);
                    console.log("After"+acesstoken);
                    console.log(imageinsert.message);
                        if(imageinsert.message=='Failed')
                        {
                            var dataToWrite=
                            {
                            "imagename":imageName,
                            "message":imageinsert.message,
                            "statuscode":"400",
                            "progressStatus":progressStatus

                            }
                        await resCall.write(JSON.stringify({
                        dataToWrite
                
                        
                    }));
                    await resCall.write("+");
                    console.log("Response Written");
                    //  console.log("Res"+JSON.stringify(resCall));
                         }

                      else
                        {
                                var dataToWrite=
                                {
                                "imagename":imageName,
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
             }
    
        }
            
        
            await resCall.end();
            console.log("status 200");
            // res.send(200);       

        });
                        
                        
    });
});


 //get acesstoken

 async function getacesstoken(ClientIdDestination,ClientSecretDestination,GrantTypeDestination,AccountIdDestination,status)
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
                    console.log("Result"+result.access_token);
                    console.log('Processing acess token'); 
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

//image inserte
async function getimageinserted(imageURL,imageName,acesstoken,base64)
{
  console.log("Imgeurl"+imageURL);
  console.log(imageName);
  var ext = path.extname(imageURL);
  var assetType = ext.substring(1);
  console.log(ext);
  var assetTypes = { ai: 16, psd: 17, pdd: 18, eps: 19, gif: 20, jpe: 21, jpeg: 22, jpg: 23, jp2: 24, jpx: 25, pict: 26, pct: 27, png: 28, tif: 29, tiff: 30, tga: 31, bmp: 32, wmf: 33, vsd: 34, pnm: 35, pgm: 36, pbm: 37, ppm: 38, svg: 39, "3fr": 40, ari: 41, arw: 42, bay: 43, cap: 44, crw: 45, cr2: 46, dcr: 47, dcs: 48, dng: 49, drf: 50, eip: 51, erf: 52, fff: 53, iiq: 54, k25: 55, kdc: 56, mef: 57, mos: 58, mrw: 59, nef: 60, nrw: 61, orf: 62, pef: 63, ptx: 64, pxn: 65, raf: 66, raw: 67, rw2: 68, rwl: 69, rwz: 70, srf: 71, sr2: 72, srw: 73, x3f: 74, "3gp": 75, "3gpp": 76, "3g2": 77, "3gp2": 78, asf: 79, avi: 80, m2ts: 81, mts: 82, dif: 83, dv: 84, mkv: 85, mpg: 86, f4v: 87, flv: 88, mjpg: 89, mjpeg: 90, mxf: 91, mpeg: 92, mp4: 93, m4v: 94, mp4v: 95, mov: 96, swf: 97, wmv: 98, rm: 99, ogv: 100, indd: 101, indt: 102, incx: 103, wwcx: 104, doc: 105, docx: 106, dot: 107, dotx: 108, mdb: 109, mpp: 110, ics: 111, xls: 112, xlsx: 113, xlk: 114, xlsm: 115, xlt: 116, xltm: 117, csv: 118, tsv: 119, tab: 120, pps: 121, ppsx: 122, ppt: 123, pptx: 124, pot: 125, thmx: 126, pdf: 127, ps: 128, qxd: 129, rtf: 130, sxc: 131, sxi: 132, sxw: 133, odt: 134, ods: 135, ots: 136, odp: 137, otp: 138, epub: 139, dvi: 140, key: 141, keynote: 142, pez: 143, aac: 144, m4a: 145, au: 146, aif: 147, aiff: 148, aifc: 149, mp3: 150, wav: 151, wma: 152, midi: 153, oga: 154, ogg: 155, ra: 156, vox: 157, voc: 158, "7z": 159, arj: 160, bz2: 161, cab: 162, gz: 163, gzip: 164, iso: 165, lha: 166, sit: 167, tgz: 168, jar: 169, rar: 170, tar: 171, zip: 172, gpg: 173, htm: 174, html: 175, xhtml: 176, xht: 177, css: 178, less: 179, sass: 180, js: 181, json: 182, atom: 183, rss: 184, xml: 185, xsl: 186, xslt: 187, md: 188, markdown: 189, as: 190, fla: 191, eml: 192, text: 193, txt: 194, freeformblock: 195, textblock: 196, htmlblock: 197, textplusimageblock: 198, imageblock: 199, abtestblock: 200, dynamicblock: 201, stylingblock: 202, einsteincontentblock: 203, webpage: 205, webtemplate: 206, templatebasedemail: 207, htmlemail: 208, textonlyemail: 209, socialshareblock: 210, socialfollowblock: 211, buttonblock: 212, layoutblock: 213, defaulttemplate: 214, smartcaptureblock: 215, smartcaptureformfieldblock: 216, smartcapturesubmitoptionsblock: 217, slotpropertiesblock: 218, externalcontentblock: 219, codesnippetblock: 220, rssfeedblock: 221, formstylingblock: 222, referenceblock: 223, imagecarouselblock: 224, customblock: 225, liveimageblock: 226, livesettingblock: 227, contentmap: 228, jsonmessage: 230 };
  var assetTypeID = assetTypes[assetType];
  console.log(assetType);
  console.log(assetTypeID);
 console.log("acesstokeninimageinserted"+acesstoken);
  
  var  data=
  {
    "name": imageName,
    "assetType": 
    {
      "name": assetType,
      "id": assetTypeID
    },
    "file": base64
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
              console.log(response);
              console.log(response.data);
              console.log("Processing Image Insertion" );
            //  var sucess="sucess";
             // var res=response.data;
              var data=
              {
                message:"sucess",
                res:response.data,
                status:response.statusCode,
                hi:"hii"
              }
              resolve(data);
        },
        (error)=>
        {
          console.log("Err"+error);
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
          console.log("Body"+body);

        }
   
      )                   
      console.log("Req"+req) 
  });
 
}

catch(err){
      console.log("Error"+err);

    }              
}
  
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running...'));