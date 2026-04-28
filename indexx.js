import express from "express";
import bodyParser from "body-parser";
import {db,auth} from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc,doc,updateDoc} from "firebase/firestore";
import { signInWithEmailAndPassword, } from "firebase/auth";

const app = express();
const port = 3000;

const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for posts
let isLoggedIn = true;

app.get("/", async (req, res) => {
  const snapshot = await getDocs(collection(db, "posts"));
  const posts = snapshot.docs.map(d => ({ _id: d.id, ...d.data() }));
  res.render("index.ejs", { posts,isLoggedIn:req.session.isLoggedIn  });
});

app.get("/newpost",requireLogin, (req, res) => {
    res.render("newpost.ejs");
});

app.post("/newpost", requireLogin, async (req, res) => {
  const { title, content } = req.body;
  await addDoc(collection(db, "posts"), {
    title,
    content,
    date: new Date().toLocaleDateString()
  });
  res.redirect("/");
});

app.get("/edit/:id", requireLogin, async (req, res) => {
  const snapshot = await getDocs(collection(db, "posts"));
  const posts = snapshot.docs.map(d => ({ _id: d.id, ...d.data() }));
  const post = posts.find(p => p._id === req.params.id);
  post ? res.render("edit.ejs", { post }) : res.send("Post not found");
});

app.post("/edit/:id", requireLogin, async (req, res) => {
  const { title, content } = req.body;
  await updateDoc(doc(db, "posts", req.params.id), { title, content });
  res.redirect("/");
});

app.get("/delete/:id", requireLogin, async (req, res) => {
  await deleteDoc(doc(db, "posts", req.params.id));
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login.ejs", { error: null });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    await signInWithEmailAndPassword(auth, email, password);
     req.session.isLoggedIn = true;
    res.redirect("/");
  } catch (err) {
    res.render("login.ejs", { error: "Invalid email or password" });
  }
});

app.get("/logout", (req, res) => {
  req.session.isLoggedIn = false;
  res.redirect("/");
});

function requireLogin(req, res, next) {
  if (!req.session.isLoggedIn) {
    next();
  } else {
     res.redirect("/login");
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
