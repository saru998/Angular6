const User = require('../model/Users')
const ProfilePicture = require('../model/ProfilePicture')

exports.login = async (req,res)=>{		//login API
    const{email,password}=req.body
    const result = await User.findOne({email,password})
    if(!result){
        return res.json({success: false, message:'Email/Password incorrect'})
    }
	req.session[email] = email
    req.session.save()
	console.log(req.session)
	res.json({success: true, message:'Login Success'})
};

exports.isUserLoggedIn = async (req,res)=>{
	res.json({status: req.session[req.query.email]? true : false })
};

exports.profile = async (req,res)=>{
    const user = await User.findOne({email:req.session[email]})
    if(!user){
        return res.json({success: false, message:'user was deleted'})
    }
    return res.json({success: true, email:req.session[email]})
};

exports.isUserExist = async (req, res) =>{		
	User.findOne({email:req.query.email},(function (err, result) {
		if (err) {
			return res.json({success: false, message: 'Something went wrong'})
		} 
		else if(result){
			return res.json({success:true,message: 'User exists'})
		}
		return res.json({success:false,message: 'User doesn\'t exists'})
	}))
};

exports.createUser = async (req, res) =>{		
	const{fname, lname, email, password, phone, gender, dob} = req.body
	const result = await User.findOne({email})
    if(result){
        return res.json({success: false, message: 'User already exists'})
    }

	const user = new User({fname, lname, email, password, phone, gender, dob})
	user.save(function (err) {  
        if (err) {  
            return res.json({success: false, message:'Something went wrong'})  
        }  
        return res.json({success: true, message:'Registration successful'})  
    })
};

exports.getOneUser = async (req, res)=>{			// get user with id
	User.findOne({email:req.query.email}, function (err, user) {
		if(err) {
			return res.json({success: false, message: 'Something went wrong'})
		}
		else if(!user){
			return res.json({success: false, message: 'User not found'})
		}
		return res.json(user)		
	}).select('fname lname email phone gender dob')
};

exports.editUser = async (req, res)=>{			// update user details	
	User.updateOne({ email: req.query.email }, req.body, function(err){
			if(err){
				return res.json({success: false, message:'Something went wrong'})
			}
			return res.json({success: true, message:'User details updated successfully'})
	})
};

exports.deleteOneUser = async (req,res)=>{		//delete user
    User.deleteOne({ email:req.query.email }, function (err) {  
        if (err) {  
            return res.json({success: false, message:'Something went wrong'})  
        }  
        return res.json({success: true, message: 'Successfully deleted' });  
    })  
};

exports.uploadProfilePic = async (req, res)=> {
	const email = req.session[email]
	User.findOne({email}, function(err, user) {		
		if(err){
			return res.json({success: false, message:'Something went wrong'})
		}
		else if(!user){
			return res.json({success: false, message: 'User not found'})
		}
		const dp = new ProfilePicture({email, path: req.file.destination+req.file.filename})
		dp.save(function(err){
		if(err)
			return res.json({success: false, message:'Something went wrong'})
		return res.json({success: true, message: 'Profile picture saved successfully'})
		})
	})
};

exports.logout = async (req,res)=>{
	delete req.session[req.query.email]
	res.json({success:true})
};