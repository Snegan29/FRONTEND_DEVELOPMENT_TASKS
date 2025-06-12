# Performance Optimization Review

## What I Found and Improved

---

### 1. **Issue:** Search was updating too often
- **What was wrong:**  
  Every time the user typed something in the search box, the app tried to update too quickly, which can slow things down.
- **How I fixed it:**  
  I created a special helper (`useDebounce`) that waits a bit before actually updating the search.
- **Why it’s better:**  
  - It doesn’t waste power on every keystroke  
  - Makes the app feel smoother  
  - Easier to use the same logic in other places later

---

### 2. **Issue:** Buttons and other functions were being recreated each time
- **What was wrong:**  
  The `Add to Cart` and `Remove from Cart` buttons were using functions that kept getting recreated on every screen update.
- **How I fixed it:**  
  I used a trick called `useCallback` to remember the function unless it really needs to change.
- **Why it’s better:**  
  - Saves memory and time  
  - Helps React work faster and smarter  
  - Keeps things stable

---

### 3. **Issue:** Some calculations were happening again and again
- **What was wrong:**  
  Things like the total cart price or the list of filtered products were being calculated every single time the screen updated—even when nothing changed.
- **How I fixed it:**  
  I used `useMemo` to tell React to only redo the math when the data changes.
- **Why it’s better:**  
  - Speeds up the app  
  - Reduces unnecessary work  
  - Makes the app more efficient

---

### 4. **Issue:** Dashboard was fetching the same data again and again
- **What was wrong:**  
  On the dashboard, if you selected the same filter again, it would re-fetch data from the (fake) API every time, which wastes time.
- **How I fixed it:**  
  I saved the results in `localStorage` so if you pick the same filter again, the app just reuses saved data.
- **Why it’s better:**  
  - Faster loading  
  - Reduces unnecessary network requests  
  - Feels smoother for the user

---

### 5. **Issue:** Too much logic mixed inside the screen design
- **What was wrong:**  
  A lot of complex calculations and states were written directly inside the screen layout, making it messy and hard to follow.
- **How I fixed it:**  
  I moved the logic and calculations outside the layout and simplified some of the state.
- **Why it’s better:**  
  - Easier to read and understand  
  - Cleaner code  
  - Fewer bugs and easier to fix problems later

---

# [My deployed link](https://product-fusion-indol.vercel.app/)