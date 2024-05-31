// Aman Mishra
// CST 2120
// 5/3/2024
// Coursework #2
//
// This script interacts with the navigation options of the social networking website and dynamically
// allows the user to change the view on the same page to respective sections of the website.

document.addEventListener("DOMContentLoaded", function () {
    // Get all buttons from sidebar
    const exploreTab = document.getElementById("explore-tab");
    const homeTab = document.getElementById("home-tab");
    const followersTab = document.getElementById("followers-tab");
    const followingTab = document.getElementById("following-tab");
    const profileTab = document.getElementById("profile-tab");

    // Get all buttons from header
    const loginBtn = document.getElementById("login-button");
    const registerBtn = document.getElementById("register-button");

    // Get all content pages we will cycle through
    const mainPage = document.getElementById("main-page");
    const homePage = document.getElementById("home-page");
    const followers = document.getElementById("followers");
    const following = document.getElementById("following");
    const profilePage = document.getElementById("profile-page");
    const login = document.getElementById("login");
    const register = document.getElementById("register");

    // Initially show only the main-page and hide others
    showContent(mainPage);

    // Add event listeners to the sidebar items
    exploreTab.addEventListener("click", function () {
        showContent(mainPage);
    });

    homeTab.addEventListener("click", function () {
        showContent(homePage);
    });

    followersTab.addEventListener("click", function () {
        showContent(followers);
    });

    followingTab.addEventListener("click", function () {
        showContent(following);
    });

    profileTab.addEventListener("click", function () {
        showContent(profilePage);
    });

    // Add event listeners to the header buttons
    loginBtn.addEventListener("click", function () {
        showContent(login);
    });

    registerBtn.addEventListener("click", function () {
        showContent(register);
    });

    // Function to show the selected content and hide others
    function showContent(content) {
        const website = [mainPage, homePage, followers, following, profilePage, login, register];

        website.forEach(function (page) {
            if (page === content) {
                page.style.display = "block";
            } else {
                page.style.display = "none";
            }
        });
    }
});
