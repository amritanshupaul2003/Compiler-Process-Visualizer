import { compile } from "../engine/compileEngine.js";

export async function compileAPI(req, res) {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: "Both 'code' and 'language' are required",
      });
    }

    const result = compile({ code, language });

    return res.status(200).json({
      success: true,
      language,
      stages: result.stages,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}
