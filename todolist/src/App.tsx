import React, {useState, useEffect} from 'react';
import './App.css';
import Form from './components/Form';
import ToList from './components/ToList';
import TypeTodo from './types/todo';

const App: React.FC = () => {
  
  const [inputText, setInputText] = useState<string>("");
  const [todos, setTodos] = useState<Array<TypeTodo>>([]);
  const [status, setStatus] = useState<string>("all");
  const [filteredTodos, setFilteredTodos] = useState<Array<TypeTodo>>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(undefined);
  const [swRegistration, setSWRegistration] = useState<any>(undefined);
  const sw = navigator.serviceWorker;
  const [applicationServerPublicKey, setPKey] = useState<string>('BPjMIsTf7PCN87d9utjdDzvZ3zFQspL9OJimv9r3laaYf_bOsWFz2LwfIdFiuy7L7qc3tba6AqMKyoF4joUdJG8');
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    filterHandler()
  }, [todos, status])

  useEffect(() => {
    window.addEventListener("load", () => {
        sw.register('./sw.js')
          .then((swReg) => {
            setSWRegistration(swReg);
            sw.addEventListener("message", function (event) {
                console.log("Service worker received message:", event);
                if (event.data.todos) {
                  console.log("Service worker received message:", event.data.todos.todos);
                  setTodos(event.data.todos.todos)
                }
                console.log(event.data.notification)
                if (event.data.notification) {
                  setSuccess("You received message: " + event.data.notification);
                  setError("");
                }

                if (event.data.error) {
                  setError(event.data.error);
                }
            });
          })
          .catch(e => {
            console.log("Error!", e);
        });
    });

    window.addEventListener("beforeinstallprompt", function (e) {
      console.log("beforeinstallprompt Event fired");
      e.preventDefault();
      setDeferredPrompt(e);
    
      return false;
    });
    
  }, [sw])

  const handleInstall = () => {
    
    if (deferredPrompt !== undefined) {
      deferredPrompt.prompt();
  
      deferredPrompt.userChoice.then(function (choiceResult: any) {
        console.log(choiceResult.outcome);
  
        if (choiceResult.outcome == "dismissed") {
          console.log("User cancelled home screen install");
        } else {
          console.log("User added to home screen");
        }
  
        setDeferredPrompt(undefined);
      });
    } else {
      setError("You have either already installed the pwa, or you try to install in inkognito! This does not work")
      setSuccess("")
    }
  }

  const handlePush = () => {
    console.log(applicationServerPublicKey)
    
    subscribeUser();

    swRegistration.pushManager.getSubscription()
    .then(function(subscription: any) {
      let isSubscribed = !(subscription === null);
    });

  }

  function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(subscription: any) {
      console.log('User is subscribed.');
  
      updateSubscriptionOnServer(subscription);
  
    })
    .catch(function(err: any) {
      console.log('Failed to subscribe the user: ', err);
      setError("Invalid public key! Please provide key from https://web-push-codelab.glitch.me/ . Push does not work in inkognito tab");
      setSuccess("");
    });

    function updateSubscriptionOnServer(subscription: any) {
      if (subscription ) {
        console.log(JSON.stringify(subscription));
        setSuccess("To test notication go to https://web-push-codelab.glitch.me/ and copy: " + JSON.stringify(subscription))
        setError("")
      }
    }
  }

  const handleShare = async() => {
    const shareData = {
      title: 'Todolist',
      text: 'Create your todolist!',
      url: 'localhost:3000'
    }

    try {
      await navigator.share(shareData)
      console.log("share workes")
    } catch(err) {
      setSuccess("")
      setError("Share api does only work on mobile")
      console.log("share does only work on mobile")
    }
  }

  const filterHandler = () => {
    switch (status) {
      case 'all':
          setFilteredTodos(todos)
          break;
      case 'completed':
          setFilteredTodos(todos.filter(el => el.complete === true))
          break;
      case 'uncompleted':
          setFilteredTodos(todos.filter(el => el.complete === false))
          break;
  }
  }
  return (
    <div className="App">
      <header>
        <h1>Valis Todo List</h1>
      </header>
      <div className={"error"} style={error ? {display: "flex", visibility: "visible"} : {}}>
        {error}
      </div>
      <div className={"notification"} style={success ? {display: "flex", visibility: "visible"} : {}}>
        {success}
      </div>
      <Form 
        inputText={inputText}
        todos={todos}
        setTodos={setTodos}
        setInputText={setInputText}
        setStatus={setStatus}
        status={status}
        sw={sw}
        >
        </Form>
      <ToList 
        setTodos={setTodos} 
        todos={todos}
        filteredTodos={filteredTodos}
        sw={sw}
        >
      </ToList>
      <div className={"container"}>
        <button className={"install"} onClick={handleInstall}>Install App</button>
        <div className={"info"}>
          Insert public key from https://web-push-codelab.glitch.me/ to try push:
        </div>
        <input className={"input"} placeholder={"Public key here"} onChange={(e) => setPKey(e.target.value)}></input>
        <button className={"push"} onClick={handlePush}>Push</button>
        <button className={"install"} onClick={handleShare}>Share</button>
      </div>
      
    </div>
  );
}

export default App;

function urlB64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

