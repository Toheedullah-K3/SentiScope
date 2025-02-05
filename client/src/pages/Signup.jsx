import React from 'react'
import wave from '../assets/images/wave.png'
import LoginBG from '../assets/images/LoginBG.svg'
import avatar from '../assets/images/avatar.svg'

const Signup = () => {
  return (
    <section>
      <img class="wave" src= {wave} />
	<div class="containerLogin">
		<div class="img">
			<img src= {LoginBG} />
		</div>
		<div class="login-content">
			<form action="index.html">
				<img src= {avatar} />
				<h2 class="title">Welcome</h2>
           		<div class="input-div one">
           		   <div class="i">
           		   		<i class="fas fa-user"></i>
           		   </div>
           		   <div class="div">
           		   		<h5>Username</h5>
           		   		<input type="text" class="input" />
           		   </div>
           		</div>
           		<div class="input-div pass">
           		   <div class="i"> 
           		    	<i class="fas fa-lock"></i>
           		   </div>
           		   <div class="div">
           		    	<h5>Password</h5>
           		    	<input type="password" class="input" />
            	   </div>
            	</div>
            	<a href="#">Forgot Password?</a>
            	<input type="submit" class="btn" value="Login" />
            </form>
        </div>
    </div>
    </section>
  )
}

export default Signup