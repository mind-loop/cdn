const asyncHandler = require("../middleware/asyncHandle");
const sendEmail = require("../utils/email");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate-sequelize");
exports.createEmail = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const email = await req.db.email.create({
    ...body
  })
  if (!email) {
    throw new MyError("Нэмэх явцад алдаа гарлаа", 400);
  }

  res.status(200).json({
    message: "",
    body: { success: true },
  });
})
exports.getEmail = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  if (!id) {
    throw new MyError("Мэдээлэл олдсонгүй", 400);
  }
  const email = await req.db.email.findByPk(id)
  res.status(200).json({
    message: "",
    body: email,
  });
})
exports.getEmails = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1000;
  const sort = req.query.sort;
  let select = req.query.select;

  if (select) {
    select = select.split(" ");
  }

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, req.db.email);

  let query = { offset: pagination.start - 1, limit };

  if (req.query) {
    if (!req.userId) {
      req.query = { ...req.query }
    }
    query.where = req.query;
  }

  if (select) {
    query.attributes = select;
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "DESC" : "ASC",
      ]);
  }

  const email = await req.db.email.findAll(query);
  res.status(200).json({
    success: true,
    body: {
      items: email, total: email.length,
      pagination
    }
  }
  );
})
exports.deleteEmail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const email = await req.db.email.findByPk(id);
  if (!email) {
    throw new MyError(`Таны устгах гэсэн ${id} дугаартай мэдээлэл олдсонгүй`, 404)
  }
  await email.destroy();

  res.status(200).json({
    message: "email Deleted",
    body: { success: true }
  });
});
exports.activeEmail = asyncHandler(async (req, res, next) => {
  const email = await req.db.email.findOne({
    where: {
      is_active: true
    }
  })
  res.status(200).json({
    message: "",
    body: email,
  });
});

exports.changeActiveEmail = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const email = await req.db.email.findByPk(id);

  if (!email) {
    throw new MyError("Email олдсонгүй", 404);
  }

  await req.db.email.update(
    { is_active: false },
    { where: {} }
  );
  await req.db.email.update(
    { is_active: true },
    { where: { id } }
  );
  res.status(200).json({
    success: true,
    message: `Email (${email.name || "id: " + id}) идэвхжлээ`
  });
});

exports.updateEmail = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const email = await req.db.email.update({ ...req.body }, {
    where: {
      id
    }
  })
  if (!email) {
    throw new MyError("Мэдээллийг шинэчилэх явцад алдаа гарлаа", 401)
  }
  res.status(200).json({
    message: "Success",
    body: { success: true }
  });
});


exports.emailHTMLsent = asyncHandler(async (req, res, next) => {
  const { html, title, email, from } = req.body
  if (!title || !html || !email || !from) {
    throw new MyError("Алдаа гарлаа", 400);
  }
  const smtp = await req.db.email.findOne({
    where: {
      is_active: true
    }
  })
  await sendEmail({
    subject: title,
    email,
    from,
    message: html,
    isHtml: true,
    smtp_username: smtp?smtp.username : process.env.SMTP_USERNAME,
    smtp_password: smtp?smtp.password : process.env.SMTP_PASSWORD,
  });
  res.status(200).json({
    message: "Email HTML Sent",
    body: { success: true }
  });
});

exports.emailTXTsent = asyncHandler(async (req, res, next) => {
  const { text, title, email, from } = req.body
  if (!title || !text || !email || !from) {
    throw new MyError("Алдаа гарлаа", 400);
  }
  const smtp = await req.db.email.findOne({
    where: {
      is_active: true
    }
  })
  await sendEmail({
    subject: title,
    email,
    from,
    message: text,
    isHtml: false,
    smtp_username: smtp?smtp.username : process.env.SMTP_USERNAME,
    smtp_password: smtp?smtp.password : process.env.SMTP_PASSWORD,
  });
  res.status(200).json({
    message: "Email Text Sent",
    body: { success: true }
  });
});