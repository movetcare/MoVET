class Logger {
  static collectors = [];
  static serializer = Promise.resolve;

  static setCollectors(collectors: any) {
    this.collectors = collectors;
  }

  static async forwardToCollectors(log: any) {
    this.collectors.forEach(collector => (collector as any).collect(log));
  }

  static log(log: any) {
    Logger.forwardToCollectors(log);
  }

  static tracedFn(methodName: any, docsUrl: any, fn: any) {
    return async (...args: any) => {
      const method = methodName || fn.name;
      const requestString = JSON.stringify(args);
      const UUID = Math.floor(Math.random() * 10000000).toString();
      const trace: any = {
        id: UUID,
        start_time_ms: new Date().valueOf(),
        method: method,
        docsUrl: docsUrl,
        request: requestString,
        response: null,
        exception: null,
      };

      try {
        const response = await fn.apply(this, args);
        trace.response = JSON.stringify(response);
        return response;
      } catch (e: any) {
        trace.exception = e.message;
        throw e;
      } finally {
        Logger.log(trace);
      }
    };
  }

  static watchObject(obj: any, objName: any, methodsMetadata: any) {
    const objPrototype = Object.getPrototypeOf(obj);
    Object.getOwnPropertyNames(objPrototype)
      .filter(property => methodsMetadata[property] !== undefined)
      .forEach(instanceMethodName => {
        obj[instanceMethodName] = Logger.tracedFn(
          objName + '.' + instanceMethodName,
          methodsMetadata[instanceMethodName].docsUrl,
          objPrototype[instanceMethodName]
        );
      });
  }
}

export default Logger;
