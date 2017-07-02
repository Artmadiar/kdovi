/**
  @apiDefine InternalError
  @apiError (Error 5xx) InternalError
  */
class InternalError {
  constructor(msg) {
    this.msg = msg || null;
    this.code = 500;
  }
}

/**
  @apiDefine SessionError
  @apiError (Error 5xx) SessionError
  @apiGroup 5xx
  */
class SessionError extends InternalError {}

/**
  @apiDefine SessionError
  @apiError (Error 5xx) SessionError
  @apiGroup 5xx
  */
class EmailTemplateNotFoundError extends InternalError {}

/**

  @apiDefine Not Implemented
  @apiError (Error 5xx) NotImplemented
  */
class NotImplemented extends InternalError {
  constructor() {
    super();

    this.code = 501;
  }
}

/**
  @apiDefine BadRequest
  @apiError (Error 4xx) BadRequest
  */
class BadRequest extends InternalError {
  constructor(errors) {
    super();

    this.code = 400;
    if (errors) {
      this.errors = errors;
    }
  }
}

/**
  @apiDefine Unauthorized
  @apiError (Error 4xx) Unauthorized
  */
class Unauthorized extends BadRequest {
  constructor() {
    super();

    this.code = 401;
  }
}

/**
  @apiDefine BadRequest
  @apiError (Error 4xx) BadRequest
  */
class ContentType extends BadRequest {}

/**
  @apiDefine NotFound
  @apiError (Error 4xx) NotFound
  */
class NotFound extends BadRequest {
  constructor(msg) {
    super(msg);

    this.code = 404;
  }
}

/**
  @apiDefine ResetTokenExpired
  @apiError (Error 4xx) ResetTokenExpired
  */
class ResetTokenExpired extends BadRequest {}

/**
  @apiDefine AlreadySignedUp
  @apiError (Error 4xx) AlreadySignedUp
  */
class AlreadySignedUp extends BadRequest {}

/**
  @apiDefine InvalidJson
  @apiError (Error 4xx) InvalidJson
  */
class InvalidJson extends BadRequest {
  constructor(code) {
    super();

    if (code) {
      this.code = code;
    }
  }
}

module.exports = {
  InternalError,
  NotImplemented,
  BadRequest,
  NotFound,
  AlreadySignedUp,
  SessionError,
  InvalidJson,
  ResetTokenExpired,
  ContentType,
  Unauthorized,
  EmailTemplateNotFoundError
};
