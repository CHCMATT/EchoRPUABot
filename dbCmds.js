var summaryInfo = require('./schemas/summaryInfo');

module.exports.readSummValue = async (summaryName) => {
	var result = await summaryInfo.findOne({ summaryName }, { value: 1, _id: 0 });
	if (result !== null) {
		return result.value;
	}
	else {
		return `Value not found for ${summaryName}`;
	}
};

module.exports.addSummValue = async (summaryName, value) => {
	await summaryInfo.findOneAndUpdate({ summaryName: summaryName }, { $inc: { value: value } }, { upsert: true })
};

module.exports.subtractSummValue = async (summaryName, value) => {
	await summaryInfo.findOneAndUpdate({ summaryName: summaryName }, { $inc: { value: -value } }, { upsert: true })
};

module.exports.setSummValue = async (summaryName, newValue) => {
	await summaryInfo.findOneAndUpdate({ summaryName: summaryName }, { value: newValue }, { upsert: true });
};

module.exports.resetSummValue = async (summaryName) => {
	await summaryInfo.findOneAndUpdate({ summaryName: summaryName }, { value: 0 }, { upsert: true });
};


// for setting message ID of current Discord embed message
module.exports.setMsgId = async (summaryName, newValue) => {
	await summaryInfo.findOneAndUpdate({ summaryName: summaryName }, { msgId: newValue }, { upsert: true });
};

module.exports.readMsgId = async (summaryName) => {
	var result = await summaryInfo.findOne({ summaryName }, { msgId: 1, _id: 0 });
	if (result !== null) {
		return result.msgId;
	}
	else {
		return `Value not found for ${summaryName}`;
	}
};