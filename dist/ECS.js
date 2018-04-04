(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ECS"] = factory();
	else
		root["ECS"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.BackgroundSystem = exports.System = exports.Entity = exports.World = undefined;

	var _world = __webpack_require__(1);

	var _world2 = _interopRequireDefault(_world);

	var _entity = __webpack_require__(4);

	var _entity2 = _interopRequireDefault(_entity);

	var _system = __webpack_require__(5);

	var _system2 = _interopRequireDefault(_system);

	var _backgroundSystem = __webpack_require__(7);

	var _backgroundSystem2 = _interopRequireDefault(_backgroundSystem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.World = _world2.default;
	exports.Entity = _entity2.default;
	exports.System = _system2.default;
	exports.BackgroundSystem = _backgroundSystem2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _tuple = __webpack_require__(2);

	var _tuple2 = _interopRequireDefault(_tuple);

	var _utils = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var World = function () {
	  function World() {
	    _classCallCheck(this, World);

	    this._tuples = {
	      '': new _tuple2.default([])
	    };

	    this._systems = [];

	    this._backgroundSystems = [];

	    this._runStatus = false;

	    this._components = {};
	  }

	  _createClass(World, [{
	    key: 'start',
	    value: function start() {
	      if (!this._runStatus) {
	        this._backgroundSystems.forEach(function (system) {
	          system.start();
	        });
	      }
	      this._runStatus = true;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var _this = this,
	          _arguments = arguments;

	      this._systems.forEach(function (system) {
	        if (!_this._runStatus) {
	          return;
	        }
	        // usually arguments is dt(delta time of this update and last update) and now(the current time)
	        system.update.apply(system, _arguments);
	      });
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      this._runStatus = false;
	      this._backgroundSystems.forEach(function (system) {
	        system.stop();
	      });
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this._tuples = {
	        '': new _tuple2.default([])
	      };
	      this._systems.forEach(function (system) {
	        return system.destroy();
	      });
	      this._backgroundSystems.forEach(function (system) {
	        return system.destroy();
	      });
	      this._systems = [];
	      this._backgroundSystems = [];
	      this._runStatus = false;
	    }

	    // components

	  }, {
	    key: 'addComponent',
	    value: function addComponent(component, value) {
	      var isComponent = typeof component !== 'string';
	      var name = (0, _utils.lowerCamelCase)(isComponent ? (0, _utils.getName)(component) : component);

	      this._components[name] = isComponent ? component : value !== undefined ? value : true;
	      return this;
	    }
	  }, {
	    key: 'removeComponent',
	    value: function removeComponent(name) {
	      delete this._components[(0, _utils.lowerCamelCase)(name)];
	    }
	  }, {
	    key: 'getComponent',
	    value: function getComponent(name) {
	      return this._components[name];
	    }

	    // system

	  }, {
	    key: 'addSystem',
	    value: function addSystem(system) {
	      this._systems.push(system);
	      system.addWorld(this);
	      system.init();
	      return this;
	    }
	  }, {
	    key: 'removeSystem',
	    value: function removeSystem(system) {
	      for (var i = 0; i < this._systems.length; ++i) {
	        if (this._systems[i] === system) {
	          this._systems.splice(i, 1);
	          break;
	        }
	      }
	      return this;
	    }

	    // backgroundSystem

	  }, {
	    key: 'addBackgroundSystem',
	    value: function addBackgroundSystem(system) {
	      this._backgroundSystems.push(system);
	      system.addWorld(this);
	      system.init();
	      return this;
	    }
	  }, {
	    key: 'removeBackgroundSystem',
	    value: function removeBackgroundSystem(system) {
	      for (var i = 0; i < this._backgroundSystems.length; ++i) {
	        if (this._backgroundSystems[i] === system) {
	          this._backgroundSystems.splice(i, 1);
	          break;
	        }
	      }
	      return this;
	    }

	    // entity

	  }, {
	    key: 'addEntity',
	    value: function addEntity(entity) {
	      entity.addToWorld(this);
	      for (var name in this._tuples) {
	        this._tuples[name].addEntityIfMatch(entity);
	      }
	      return this;
	    }
	  }, {
	    key: 'removeEntity',
	    value: function removeEntity(entity) {
	      entity.removeFromWorld();
	      for (var name in this._tuples) {
	        this._tuples[name].removeEntity(entity);
	      }
	      return this;
	    }
	  }, {
	    key: 'getEntities',
	    value: function getEntities() {
	      var tuple = this._ensureTupleExists(arguments);

	      return tuple.entities;
	    }
	  }, {
	    key: 'getEntity',
	    value: function getEntity(entityId) {
	      return this._tuples[''].entities[entityId];
	    }

	    // invoked by entity when component adding to entity

	  }, {
	    key: 'addEntityToTuples',
	    value: function addEntityToTuples(entity) {
	      for (var name in this._tuples) {
	        this._tuples[name].addEntityIfMatch(entity);
	      }
	    }

	    // invoked by entity when component removing from entity

	  }, {
	    key: 'removeEntityFromTuples',
	    value: function removeEntityFromTuples(entity) {
	      for (var name in this._tuples) {
	        this._tuples[name].removeEntityIfNotMatch(entity);
	      }
	    }
	  }, {
	    key: '_ensureTupleExists',
	    value: function _ensureTupleExists(componentNames) {
	      var name = Array.prototype.join.call(componentNames, ',');

	      if (!this._tuples.hasOwnProperty(name)) {
	        this._tuples[name] = new _tuple2.default(Array.prototype.slice.call(componentNames));
	        var allEntities = this._tuples[''].entities;

	        for (var i in allEntities) {
	          this._tuples[name].addEntityIfMatch(allEntities[i]);
	        }
	      }

	      return this._tuples[name];
	    }
	  }]);

	  return World;
	}();

	exports.default = World;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tuple = function () {
	  function Tuple(componentNames) {
	    _classCallCheck(this, Tuple);

	    this._componentNames = componentNames;

	    this._entities = {};
	  }

	  _createClass(Tuple, [{
	    key: "addEntityIfMatch",
	    value: function addEntityIfMatch(entity) {
	      if (!this._entities.hasOwnProperty(entity.id) && this.matchEntity(entity)) {
	        this._entities[entity.id] = entity;
	      }
	      return this;
	    }
	  }, {
	    key: "removeEntity",
	    value: function removeEntity(entity) {
	      if (this._entities.hasOwnProperty(entity.id)) {
	        delete this._entities[entity.id];
	      }
	      return this;
	    }
	  }, {
	    key: "removeEntityIfNotMatch",
	    value: function removeEntityIfNotMatch(entity) {
	      if (this._entities.hasOwnProperty(entity.id) && !this.matchEntity(entity)) {
	        delete this._entities[entity.id];
	      }
	      return this;
	    }
	  }, {
	    key: "matchEntity",
	    value: function matchEntity(entity) {
	      return entity.has.apply(entity, _toConsumableArray(this._componentNames));
	    }
	  }, {
	    key: "entities",
	    get: function get() {
	      return this._entities;
	    }
	  }]);

	  return Tuple;
	}();

	exports.default = Tuple;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var lowerCamelCase = function lowerCamelCase(name) {
	  return name[0].toLowerCase() + name.slice(1);
	};

	var getName = function getName(component) {
	  if (typeof component === 'function') {
	    return component.name;
	  }
	  return component.constructor.name;
	};

	var deepCopy = function deepCopy(data) {
	  if (data === undefined) {
	    return undefined;
	  }
	  return JSON.parse(JSON.stringify(data));
	};

	exports.lowerCamelCase = lowerCamelCase;
	exports.deepCopy = deepCopy;
	exports.getName = getName;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var entityId = 0;

	var Entity = function () {
	  function Entity() {
	    _classCallCheck(this, Entity);

	    this._id = entityId++;

	    this._world = undefined;

	    // these callbacks will be called when entity add to world
	    this._entityAddToWorldCb = [];

	    // these callbacks will be called when entity remove from world
	    this._entityRemoveFromWorldCb = [];
	  }

	  _createClass(Entity, [{
	    key: 'addToWorld',
	    value: function addToWorld(world) {
	      this._world = world;
	      this._entityAddToWorldCb.forEach(function (cb) {
	        cb();
	      });
	    }
	  }, {
	    key: 'removeFromWorld',
	    value: function removeFromWorld() {
	      this._entityRemoveFromWorldCb.forEach(function (cb) {
	        cb();
	      });
	      this._world = undefined;
	    }
	  }, {
	    key: 'insertAddToWorldCb',
	    value: function insertAddToWorldCb(cb) {
	      this._entityAddToWorldCb.push(cb);
	      return this;
	    }
	  }, {
	    key: 'insertRemoveFromWorldCb',
	    value: function insertRemoveFromWorldCb(cb) {
	      this._entityRemoveFromWorldCb.push(cb);
	      return this;
	    }
	  }, {
	    key: 'deleteRemoveFromWorldCb',
	    value: function deleteRemoveFromWorldCb(cb) {
	      for (var i = this._entityRemoveFromWorldCb.length - 1; i >= 0; i--) {
	        if (cb === this._entityRemoveFromWorldCb[i]) {
	          this._entityRemoveFromWorldCb.splice(i, 1);
	          break;
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'deleteAddToWorldCb',
	    value: function deleteAddToWorldCb(cb) {
	      for (var i = this._entityAddToWorldCb.length - 1; i >= 0; i--) {
	        if (cb === this._entityAddToWorldCb[i]) {
	          this._entityAddToWorldCb.splice(i, 1);
	          break;
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'has',
	    value: function has() {
	      for (var i in arguments) {
	        if (!this.hasOwnProperty((0, _utils.lowerCamelCase)(arguments[i]))) {
	          return false;
	        }
	      }
	      return true;
	    }

	    /**
	     * component
	     * tag
	     * key, value
	     */

	  }, {
	    key: 'addComponent',
	    value: function addComponent(component, value) {
	      var isComponent = typeof component !== 'string';
	      var name = (0, _utils.lowerCamelCase)(isComponent ? (0, _utils.getName)(component) : component);
	      var hasComponent = this.hasOwnProperty(name);

	      if (hasComponent && isComponent) {
	        this._removeComponentLifeCycle(this[name]);
	      }
	      this[name] = isComponent ? component : value !== undefined ? value : true;
	      if (isComponent) {
	        this._addComponentLifeCycle(this[name]);
	      }

	      if (!hasComponent && this._world) {
	        this._world.addEntityToTuples(this);
	      }
	      return this;
	    }
	  }, {
	    key: 'removeComponent',
	    value: function removeComponent(name) {
	      name = (0, _utils.lowerCamelCase)(name);
	      if (this.hasOwnProperty(name)) {
	        this._removeComponentLifeCycle(this[name]);
	        delete this[name];
	        if (this._world) {
	          this._world.removeEntityFromTuples(this);
	        }
	      }
	      return this;
	    }
	  }, {
	    key: '_addComponentLifeCycle',
	    value: function _addComponentLifeCycle(component) {
	      if (component.addToEntityCb) {
	        // it will be called when component added to entity
	        component.addToEntityCb(this);
	      }
	      if (component.entityAddToWorldCb) {
	        // it will be called when entity add to world
	        this.insertAddToWorldCb(component.entityAddToWorldCb);
	      }
	      if (component.entityRemoveFromWorldCb) {
	        // it will be called when entity remove from world
	        this.insertRemoveFromWorldCb(component.entityRemoveFromWorldCb);
	      }
	      return this;
	    }
	  }, {
	    key: '_removeComponentLifeCycle',
	    value: function _removeComponentLifeCycle(component) {
	      if (component.entityAddToWorldCb) {
	        this.deleteAddToWorldCb(component.entityAddToWorldCb);
	      }
	      if (component.entityRemoveFromWorldCb) {
	        this.deleteRemoveFromWorldCb(component.entityRemoveFromWorldCb);
	      }
	      if (component.removeFromEntityCb) {
	        // it will be called when component remove from entity
	        component.removeFromEntityCb(this);
	      }
	      return this;
	    }
	  }, {
	    key: 'id',
	    get: function get() {
	      return this._id;
	    }
	  }, {
	    key: 'world',
	    get: function get() {
	      return this._world;
	    }
	  }]);

	  return Entity;
	}();

	exports.default = Entity;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _baseSystem = __webpack_require__(6);

	var _baseSystem2 = _interopRequireDefault(_baseSystem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var System = function (_BaseSystem) {
	  _inherits(System, _BaseSystem);

	  function System() {
	    _classCallCheck(this, System);

	    return _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).apply(this, arguments));
	  }

	  _createClass(System, null, [{
	    key: 'update',
	    value: function update() {
	      throw 'System.update must be overwrited';
	    }
	  }]);

	  return System;
	}(_baseSystem2.default);

	exports.default = System;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BaseSystem = function () {
	  function BaseSystem() {
	    _classCallCheck(this, BaseSystem);
	  }

	  _createClass(BaseSystem, null, [{
	    key: 'addWorld',
	    value: function addWorld(world) {
	      this._world = world;
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this._world = undefined;
	      this._restrictRemove = [];
	      this._restrictAdd = [];
	      this._restrictGet = [];
	    }
	  }, {
	    key: 'init',
	    value: function init() {}
	  }, {
	    key: 'destroy',
	    value: function destroy() {}
	  }, {
	    key: 'removeComponent',
	    value: function removeComponent(name) {
	      if (this._world === undefined) {
	        console.error('System did\'t add to world');
	        throw 'System did\'t add to world';
	      }
	      if (this._restrict && this._restrictRemove.indexOf(name) === -1) {
	        console.log('Restrict to remove ' + name);
	        throw 'Restrict to remove ' + name;
	      }
	      this._world.removeComponent(name);
	    }
	  }, {
	    key: 'getComponent',
	    value: function getComponent(name) {
	      if (this._world === undefined) {
	        console.error('System did\'t add to world');
	        throw 'System did\'t add to world';
	      }
	      if (this._restrict && this._restrictGet.indexOf(name) === -1) {
	        console.log('Restrict to get ' + name);
	        throw 'Restrict to get ' + name;
	      }
	      // before release, remove deepCopy function to improve performance
	      if (this._useStrict) {
	        return (0, _utils.deepCopy)(this._world.getComponent(name));
	      }
	      return this._world.getComponent(name);
	    }
	  }, {
	    key: 'addComponent',
	    value: function addComponent(component, value) {
	      if (this._world === undefined) {
	        console.error('System did\'t add to world');
	        throw 'System did\'t add to world';
	      }
	      var isComponent = typeof component !== 'string';
	      var name = (0, _utils.lowerCamelCase)(isComponent ? (0, _utils.getName)(component) : component);

	      if (this._restrict && this._restrictAdd.indexOf(name) === -1) {
	        console.log('Restrict to add ' + name);
	        throw 'Restrict to add ' + name;
	      }
	      this._world.addComponent(component, value);
	    }
	  }, {
	    key: 'getEntities',
	    value: function getEntities() {
	      var _world;

	      if (this._world === undefined) {
	        console.error('System did\'t add to world');
	        throw 'System did\'t add to world';
	      }

	      return (_world = this._world).getEntities.apply(_world, arguments);
	    }
	  }, {
	    key: 'getEntity',
	    value: function getEntity() {
	      var _world2;

	      if (this._world === undefined) {
	        console.error('System did\'t add to world');
	        throw 'System did\'t add to world';
	      }

	      var entities = (_world2 = this._world).getEntities.apply(_world2, arguments);
	      for (var key in entities) {
	        return entities[key];
	      }
	      return undefined;
	    }
	  }]);

	  return BaseSystem;
	}();

	BaseSystem._restrictRemove = [];
	BaseSystem._restrictAdd = [];
	BaseSystem._restrictGet = [];
	BaseSystem._useStrict = false;
	BaseSystem._restrict = false;
	exports.default = BaseSystem;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _baseSystem = __webpack_require__(6);

	var _baseSystem2 = _interopRequireDefault(_baseSystem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BackgroundSystem = function (_BaseSystem) {
	  _inherits(BackgroundSystem, _BaseSystem);

	  function BackgroundSystem() {
	    _classCallCheck(this, BackgroundSystem);

	    return _possibleConstructorReturn(this, (BackgroundSystem.__proto__ || Object.getPrototypeOf(BackgroundSystem)).apply(this, arguments));
	  }

	  _createClass(BackgroundSystem, null, [{
	    key: 'start',
	    value: function start() {
	      throw 'BackgroundSystem.start must be overwrited';
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      throw 'BackgroundSystem.stop must be overwrited';
	    }
	  }]);

	  return BackgroundSystem;
	}(_baseSystem2.default);

	exports.default = BackgroundSystem;

/***/ })
/******/ ])
});
;