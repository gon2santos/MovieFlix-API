'use strict'
// const router = require('./routes')
const express = require('express')
const model = require('./models/model.js')

const app = express()

// Acuérdense de agregar su router o cualquier middleware que necesiten acá.

app.use(express.json())
// app.use(router)

app.get("/users", function (req, res) {
    res.json(model.listUsers());
})

app.post("/users", function (req, res) {
    try {
        const msg = model.addUser(req.body.email, req.body.name);
        res.status(201).json({ msg });
    } catch {
        res.status(400).json({ error: 'El usuario ya existe' });
    }
})

app.patch("/users/plan", function (req, res) {
    try {
        const msg = model.switchPlan(req.query.user);
        res.status(200).json({ msg });
    } catch {
        res.status(404).json({ error: 'Usuario inexistente' });
    }
})

app.get("/series", function (req, res) {
    res.json(model.listSeries());
})

app.post("/series", function (req, res) {
    try {
        const msg = model.addSerie(req.body.name, req.body.seasons, req.body.category, req.body.year);
        res.status(201).json({ msg });
    } catch (e) {
        if (e.name === "existError")
            res.status(400).json({ error: e.message });
        else if (e.name === "categoryError")
            res.status(400).json({ error: e.message });
    }
})

app.get("/series/:category", function (req, res) {
    try {
        res.status(200).json(model.listSeries(req.params.category));
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})

app.get("/play/:serie", function (req, res) {
    try {
        const msg = model.play(req.params.serie, req.query.user);
        res.status(200).json({ msg });
    } catch (e) {
        if (e.name === "usrExistError")
            res.status(404).json({ error: e.message });
        else if (e.name === "serExistError")
            res.status(404).json({ error: e.message });
        else if (e.name === "contentUnavailableError")
            res.status(404).json({ error: e.message });
    }
})

app.get("/watchAgain", function (req, res) {
    try {
        res.status(200).json(model.watchAgain(req.query.user));
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})

app.post("/rating/:serie", function(req, res){
    try {
        res.status(200).json({msg : model.rateSerie(req.params.serie, req.body.email, req.body.score)});
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
})

module.exports = app
