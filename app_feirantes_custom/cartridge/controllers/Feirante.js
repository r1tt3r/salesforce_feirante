'use strict';

var server = require('server');

server.get('Show', function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var customObjMgr = require('dw/object/CustomObjectMgr');
    var actionUrl = URLUtils.url('Feirante-Subscribe').toString();
    var feiranteForm = server.forms.getForm('feirante');
    feiranteForm.clear();

    if (!req.currentCustomer.profile) {
        res.render('account/login', {});
        return next();
    }

    var response = {
        actionURL: actionUrl,
        feiranteForm: feiranteForm,
        user: req.currentCustomer.profile
    };

    var userId = parseInt(req.currentCustomer.profile.customerNo);
    var allobjects = customObjMgr.getAllCustomObjects('feirante');
    for (var i = 0; i < allobjects.count; i++) {
        if (allobjects.hasNext()) {
            var object = customObjMgr.getCustomObject(
                'feirante',
                allobjects.next().custom.storename
            );

            if (object.custom.userId === userId) {
                response.haveRegister = true;
                break;
            }
        }
    }

    if (response.haveRegister) {
        response.actionURL = URLUtils.url('Feirante-Update').toString();
        response.deleteURL = URLUtils.url('Feirante-Delete').toString();
        response.data = object.custom;
    }

    res.render('/feirante/feirante', response);

    next();
});

server.post('Subscribe', function (req, res, next) {
    var feiranteForm = server.forms.getForm('feirante');
    var transaction = require('dw/system/Transaction');
    var customObjMgr = require('dw/object/CustomObjectMgr');

    transaction.wrap(function () {
        var newFeirante = customObjMgr.createCustomObject(
            'feirante',
            feiranteForm.storename.value
        );
        newFeirante.custom.firstname = feiranteForm.firstname.value;
        newFeirante.custom.lastname = feiranteForm.lastname.value;
        newFeirante.custom.email = feiranteForm.email.value;
        newFeirante.custom.storename = feiranteForm.storename.value;
        newFeirante.custom.city = feiranteForm.city.value;
        newFeirante.custom.userId = feiranteForm.userId.value;
    });

    res.render('/feirante/feirantesuccess');

    next();
});

server.get('Delete', function (req, res, next) {
    var customObjMgr = require('dw/object/CustomObjectMgr');
    var Transaction = require('dw/system/Transaction');

    if (!req.currentCustomer.profile) {
        res.render('account/login', {});
        return next();
    }

    var userId = parseInt(req.currentCustomer.profile.customerNo);
    var allobjects = customObjMgr.getAllCustomObjects('feirante');
    for (var i = 0; i < allobjects.count; i++) {
        if (allobjects.hasNext()) {
            var object = customObjMgr.getCustomObject(
                'feirante',
                allobjects.next().custom.storename
            );

            if (object.custom.userId === userId) {
                Transaction.wrap(function () {
                    customObjMgr.remove(object);
                });
                break;
            }
        }
    }

    res.redirect('/on/demandware.store/Sites-ACNOrganicFood-Site/default/Feirante-Show');

    next();
});

server.post('Update', function (req, res, next) {
    var feiranteForm = server.forms.getForm('feirante');
    var transaction = require('dw/system/Transaction');
    var customObjMgr = require('dw/object/CustomObjectMgr');

    transaction.wrap(function () {
        var loadFeirante = customObjMgr.getCustomObject(
            'feirante',
            feiranteForm.feirante.value
        );
        loadFeirante.custom.firstname = feiranteForm.firstname.value;
        loadFeirante.custom.lastname = feiranteForm.lastname.value;
        loadFeirante.custom.email = feiranteForm.email.value;
        loadFeirante.custom.storename = feiranteForm.storename.value;
        loadFeirante.custom.city = feiranteForm.city.value;
    });

    res.redirect('/on/demandware.store/Sites-ACNOrganicFood-Site/default/Feirante-Show');

    next();
});

module.exports = server.exports();
