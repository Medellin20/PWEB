const Anonymmodel = require("../models/anonym_model").AnonymModel
const responses = require("../helpers/api_responses")

function anonym_ (data){
    this.identifier = data.identifier;
    this.maxCryptView = data.maxCryptView;
    this.maxArticleView = data.maxArticleView;
}



exports.AnonymCreate = async (req , res) => {
    try{

        const existingAnoValues = await Anonymmodel.findOne({
            $or: [{ identifier: req.body.identifier }, { identifier: req.body.identifier }],
        });

        if (existingAnoValues) {
            return responses.unauthorized(res, "This identifier already exists");
        }

        const anonym = new Anonymmodel({
            identifier: req.body.identifier,
            maxCryptView: req.body.maxCryptView,
            maxArticleView: req.body.maxArticleView
        })

        anonym.save((err) => {
            if (err) return responses.error(res , err)
            let AnonymCreated = new anonym_(anonym)
            return responses.successData(res , "Values succesfully set" , AnonymCreated)
        })
    } catch (err){
        return responses.error(res , err)
    }

}

exports.updateanonym = async (req, res) => {
    try {
      const { identifier, newmaxCryptView, newmaxArticleView } = req.body;
      const anonym = await Anonymmodel.findOne({ identifier });
      
      if (!anonym) {
        return responses.unauthorized(res, "Identifier does not exist!!!");
      }
        
      anonym.maxCryptView = newmaxCryptView;
      anonym.maxArticleView = newmaxArticleView;

      await anonym.save();
  
      return responses.success(res, "Values succesfully update");
    } catch (err) {
      return responses.error(res, err);
    }
  };