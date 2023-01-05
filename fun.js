const someObj = {
    greeting:"hi",
    name:"Sean",
    occupation:"coder"
}

function sayGreeting({greeting, name}){
    console.log(greeting + ', my name is ' +name )
}

sayGreeting(someObj)