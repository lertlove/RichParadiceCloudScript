handlers.helloWorld = function (args)
{
	var message = "Hi " + args.name;
	log.info(message);

	return { messageValue: message };
}

handlers.UpdateCurrency = function (args)
{
	if(args.amount>=0){
		var addCurrencyResult = server.AddUserVirtualCurrency({
			PlayFabId: currentPlayerId,
			VirtualCurrency: args.code,
			Amount: args.amount
		});
	}else{
		var subtractCurrencyResult = server.SubtractUserVirtualCurrency({
			PlayFabId: currentPlayerId,
			VirtualCurrency: args.code,
			Amount: args.amount*-1
		});
	}

	var dict ={};
	dict[args.key]= args.curAmount;
	
	var updateUserDataResult = server.UpdateUserData({
		PlayFabId: currentPlayerId,
		Data: dict,
		Permission: "Public"
	});

	return "OK";
}

handlers.SendPush = function (args)
{
	if(args.roomName!=""){
		var dict ={};
		dict["ROOM_KEY"] = args.roomName;
		dict["INVITE_MESSAGE"] = args.message;
		
		var updateUserDataResult = server.UpdateUserData({
		PlayFabId: args.playFabId,
		Data: dict,
		Permission: "Public"
		});
	}
	
	var sendPushNotificationResult = server.SendPushNotification({
		Recipient: args.playFabId,
		Message: args.message
	});
}


handlers.RetrievePush = function (args)
{
	var userData = server.GetUserData({ PlayFabId: currentPlayerId });

	var result = {};
	
	if("ROOM_KEY" in userData.Data){
		result["ROOM_KEY"] = userData.Data["ROOM_KEY"].Value;
	}

	if("INVITE_MESSAGE" in userData.Data){
		result["INVITE_MESSAGE"] = userData.Data["INVITE_MESSAGE"].Value;
	}

	var dict ={};
	dict["ROOM_KEY"] = "";
	dict["INVITE_MESSAGE"] = "";

	var updateUserDataResult = server.UpdateUserData({
	PlayFabId: currentPlayerId,
	Data: dict,
	Permission: "Public"
	});
	
	return result;
}
