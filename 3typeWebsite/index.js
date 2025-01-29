// function updateTime() {
//     const d2Element = document.getElementById('d2');
//     const now = new Date();

//     const dateOptions = {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//     };

//     const timeOptions = {
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: false, // Use 24-hour format
//     };

//     const dateFormat = new Intl.DateTimeFormat('en-US', dateOptions);
//     const timeFormat = new Intl.DateTimeFormat('en-US', timeOptions);

//     const dateStr = dateFormat.format(now);
//     let timeStr = timeFormat.format(now);

//     // Convert 24:00 to 00:00
//     if (timeStr.startsWith('24:')) {
//         timeStr = '00' + timeStr.slice(2);
//     }

//     d2Element.querySelector('h4').innerHTML = `${dateStr}<br>${timeStr}`;
// }

// // Update the time initially
// updateTime();

// // Update the time every second (1000 milliseconds)
// setInterval(updateTime, 1000);
// Mapping of writing systems to their corresponding icons
const writingSystemIcons = {
    "Simplified Chinese": "简",
    "Traditional Chinese": "繁",
    "Latin": "Aa",
    "Japanese Hiragana": "あ",
    "Japanese Katakana": "ア",
    "Emoji": "☺",
    "Cyrillic": "К",
    "Greek": "Ω",
    "Arabic": "ع",
    "Persian": "پ",
    "Hebrew": "א"
    // Add more mappings as needed
  };
  
  let postsData = "";
  let currentFilters = {
    writingSystems: [],
    technology: []
  };
  
  const postsContainer = document.querySelector("#posts-container");
  const writingSystemsContainer = document.querySelector("#post-writingSystems");
  const technologiesContainer = document.querySelector("#post-technologies");
  const postCount = document.querySelector("#post-count");
  const noResults = document.querySelector("#no-results");
  
  fetch("typefaces.json").then(async (response) => {
    postsData = await response.json();
    postsData.map((post) => createPost(post));
    postCount.innerText = postsData.length;
  
    // Prepare writing systems data with icons
    let writingSystemsData = [];
  
    postsData.forEach((post) => {
      post.writingSystems.forEach((writingSystem) => {
        writingSystemsData.push({
          name: writingSystem,
          icon: writingSystemIcons[writingSystem] // Lookup the icon from the mapping object
        });
      });
    });
  
    // Remove duplicates based on the name and icon
    writingSystemsData = writingSystemsData.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name && t.icon === value.icon)
    );
  
    // Create filter buttons for writing systems
    writingSystemsData.map((writingSystem) =>
      createFilter("writingSystems", writingSystem, writingSystemsContainer)
    );
  
    // Prepare and create filter buttons for technologies
    const technologyData = [...new Set(postsData.map((post) => post.technology))];
    technologyData.map((technology) =>
      createFilter("technology", technology, technologiesContainer)
    );
  });
  
  // Function to create and display each post
  const createPost = (postData) => {
    const { title, link, image, writingSystems, technology } = postData;
    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = `
      <a class="post-preview" href="${link}" target="_blank">
        <img class="post-image" src="${image}">
      </a>
      <div class="post-content">
        <p class="post-title">${title}</p>
        <div class="post-tags">
          ${writingSystems
            .map((writingSystem) => {
              const icon = writingSystemIcons[writingSystem] || "";
              return `<span class="post-tag">${icon} ${writingSystem}</span>`;
            })
            .join("")}
        </div>
        <div class="post-footer">
          <span class="post-technology">${technology}</span>
        </div>
      </div>
    `;
    postsContainer.append(post);
  };
  
  // Function to create filter buttons
  const createFilter = (key, param, container) => {
    const filterButton = document.createElement("button");
    filterButton.className = "filter-button";
  
    // Display both the icon and the name
    filterButton.innerHTML = `${param.icon} ${param.name}`;
    
    filterButton.setAttribute("data-state", "inactive");
    filterButton.addEventListener("click", (e) =>
      handleButtonClick(e, key, param.name, container)
    );
  
    container.append(filterButton);
  };
  
  // Function to handle filter button click events
  const handleButtonClick = (e, key, param, container) => {
    const button = e.target;
    const buttonState = button.getAttribute("data-state");
    if (buttonState == "inactive") {
      button.classList.add("is-active");
      button.setAttribute("data-state", "active");
      currentFilters[key].push(param);
      handleFilterPosts(currentFilters);
    } else {
      button.classList.remove("is-active");
      button.setAttribute("data-state", "inactive");
      currentFilters[key] = currentFilters[key].filter((item) => item !== param);
      handleFilterPosts(currentFilters);
    }
  };
  
  // Function to filter and display posts based on selected filters
  const handleFilterPosts = (filters) => {
    let filteredPosts = [...postsData];
    const filterKeys = Object.keys(filters);
  
    filterKeys.forEach((key) => {
      const currentKey = filters[key];
      if (currentKey.length <= 0) {
        return;
      }
  
      filteredPosts = filteredPosts.filter((post) => {
        const currentValue = post[key];
        return Array.isArray(currentValue)
          ? currentValue.some((val) => currentKey.includes(val))
          : currentKey.includes(currentValue);
      });
    });
  
    postCount.innerText = filteredPosts.length;
  
    if (filteredPosts.length == 0) {
      noResults.innerText = "Sorry, we couldn't find any results.";
    } else {
      noResults.innerText = "";
    }
  
    postsContainer.innerHTML = "";
    filteredPosts.map((post) => createPost(post));
  };
  