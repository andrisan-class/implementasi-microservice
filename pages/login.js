import { useCallback } from "react";
import Head from "next/head";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import app from "../api/firebase";
import {useToasts } from 'react-toast-notifications';
import Link from "next/link";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    fontFamily: "inherit",
    fontWeight: "bold",
    backgroundColor: "#00D9C0",
  },
}));

export default function Login({ history }) {
  const { addToast } = useToasts();
  const classes = useStyles();
  const router = useRouter()
  const cookies = new Cookies();
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        cookies.set("uid", app.auth().currentUser.uid, { path: "/" });
        addToast('Logged in Successfully', { appearance: 'success' })
        router.push("/");
      } catch (err) {
        alert(err);
        addToast('Something went wrong', { appearance: 'error' })
      }
    },
    [history]
  );
  if(cookies.get("uid")){
    router.push("/");
  }
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <Container
        style={{
          height: "100vh",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
        component="main"
        maxWidth="xs"
      >
        <Typography
          style={{ fontFamily: "inherit", fontWeight: "bold" }}
          component="h1"
          variant="h5"
        >
          Sign in
        </Typography>
        <form onSubmit={handleLogin} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
        <Link href="/register">
          <Button style={{ marginTop: "1rem", fontFamily: "inherit" }}>
            Don't have an account? Register
          </Button>
        </Link>
      </Container>
    </div>
  );
}
