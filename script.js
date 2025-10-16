 // Generate bar chart data
 function generateBarChart() {
    const barGroup = document.getElementById('barGroup');
    const barCount = 36; // Increased number of bars for better distribution
    
    // Generate pattern of heights to match the image more closely
    // This creates a wave-like pattern similar to the screenshot
    const heightPattern = [
      50, 65, 70, 75, 60, 55, 50, 45, 50, 55, 
      60, 65, 70, 80, 90, 110, 100, 90, 80, 70, 
      75, 80, 85, 65, 60, 70, 75, 80, 85, 90, 
      80, 70, 75, 80, 95, 80
    ];
    
    for (let i = 0; i < barCount; i++) {
      // Get height from pattern or random if beyond pattern length
      const heightPercent = heightPattern[i % heightPattern.length];
      
      // Gray bar's height is around 10-15% of the total bar
      const grayHeightPercent = Math.random() * 5 + 10;
      
      const barWrapper = document.createElement('div');
      barWrapper.className = 'bar-wrapper';
      
      // Create gray top part
      const grayBar = document.createElement('div');
      grayBar.className = 'gray-bar';
      grayBar.style.height = `${grayHeightPercent}%`;
      
      // Create orange main part
      const orangeBar = document.createElement('div');
      orangeBar.className = 'orange-bar';
      orangeBar.style.height = `${heightPercent - grayHeightPercent + 70}px`; // +4 for overlap
      
      barWrapper.appendChild(grayBar);
      barWrapper.appendChild(orangeBar);
      barGroup.appendChild(barWrapper);
    }
  }

  // Generate line chart
  function generateLineChart() {
    const lineChart = document.getElementById('lineChart');
    const pointCount = 4;
    const chartWidth = lineChart.offsetWidth - 120; // Account for visitors box
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", chartWidth);
    svg.setAttribute("height", "100");
    
    // Points to match the design more closely
    const points = [
      { x: 0.1 * chartWidth, y: 70 },
      { x: 0.4 * chartWidth, y: 50 },
      { x: 0.7 * chartWidth, y: 30 },
      { x: 0.9 * chartWidth, y: 20 }
    ];
    
    // Create polyline
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    const pointsString = points.map(p => `${p.x},${p.y}`).join(" ");
    polyline.setAttribute("points", pointsString);
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "gold");
    polyline.setAttribute("stroke-width", "2");
    
    // Add points
    points.forEach(p => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", p.x);
      circle.setAttribute("cy", p.y);
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "gold");
      svg.appendChild(circle);
    });
    
    svg.appendChild(polyline);
    lineChart.appendChild(svg);
  }

  // Initialize on page load
  window.onload = function() {
    generateBarChart();
    generateLineChart();
    
    // Add animation for bars
    setTimeout(() => {
      const bars = document.querySelectorAll('.gray-bar, .orange-bar');
      bars.forEach(bar => {
        const originalHeight = bar.style.height;
        bar.style.height = '0';
        bar.style.transition = 'height 1s ease-out';
        
        setTimeout(() => {
          bar.style.height = originalHeight;
        }, 100);
      });
    }, 100);
  };

  // Tab functionality
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Controls: Monthly dropdown, Filter panel, Add Widget, and Auth modal
  document.addEventListener('DOMContentLoaded', () => {
    wireControls();
    wireAuth();
  });

  function wireControls() {
    const controlButtons = document.querySelectorAll('.controls .control-btn');
    if (!controlButtons || controlButtons.length < 3) return;

    const monthlyBtn = controlButtons[0];
    const filterBtn = controlButtons[1];
    const addWidgetBtn = controlButtons[2];

    // Monthly dropdown
    monthlyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMonthlyDropdown(monthlyBtn);
    });
    document.addEventListener('click', closeMonthlyDropdown);

    // Filter panel
    filterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFilterPanel();
    });

    // Add Widget
    addWidgetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addDynamicWidget();
    });
  }

  // Monthly dropdown implementations
  let monthlyDropdownEl = null;
  function toggleMonthlyDropdown(anchor) {
    if (monthlyDropdownEl) {
      monthlyDropdownEl.remove();
      monthlyDropdownEl = null;
      return;
    }
    monthlyDropdownEl = document.createElement('div');
    monthlyDropdownEl.className = 'dropdown-menu';
    monthlyDropdownEl.innerHTML = `
      <button data-range="7">Last 7 days</button>
      <button data-range="30">Last 30 days</button>
      <button data-range="90">Last 90 days</button>
      <button data-range="365">Last 12 months</button>
    `;
    positionDropdown(anchor, monthlyDropdownEl);
    document.body.appendChild(monthlyDropdownEl);

    monthlyDropdownEl.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const days = btn.getAttribute('data-range');
        // Demo: reflect selection in the control label
        const labelSpans = anchor.querySelectorAll('span');
        if (labelSpans[1]) labelSpans[1].textContent = days === '30' ? 'Monthly' : `Last ${days}d`;
        closeMonthlyDropdown();
      });
    });
  }

  function positionDropdown(anchor, menu) {
    const rect = anchor.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = `${rect.bottom + window.scrollY + 8}px`;
    menu.style.left = `${rect.left + window.scrollX}px`;
    menu.style.minWidth = `${rect.width}px`;
    menu.style.zIndex = '2000';
  }

  function closeMonthlyDropdown() {
    if (monthlyDropdownEl) {
      monthlyDropdownEl.remove();
      monthlyDropdownEl = null;
    }
  }

  // Filter panel implementations
  let filterPanelEl = null;
  function toggleFilterPanel() {
    if (filterPanelEl) {
      filterPanelEl.classList.remove('open');
      setTimeout(() => filterPanelEl?.remove(), 200);
      filterPanelEl = null;
      return;
    }
    filterPanelEl = document.createElement('div');
    filterPanelEl.className = 'filter-panel';
    filterPanelEl.innerHTML = `
      <div class="filter-header">
        <div>Filters</div>
        <button class="filter-close">✕</button>
      </div>
      <div class="filter-body">
        <label><input type="checkbox" checked> Revenue</label>
        <label><input type="checkbox" checked> Profit</label>
        <label><input type="checkbox"> Visitors</label>
        <label><input type="checkbox"> Conversion</label>
      </div>
      <div class="filter-footer">
        <button class="btn-secondary">Reset</button>
        <button class="btn-primary">Apply</button>
      </div>
    `;
    document.body.appendChild(filterPanelEl);
    requestAnimationFrame(() => filterPanelEl.classList.add('open'));

    filterPanelEl.querySelector('.filter-close').addEventListener('click', toggleFilterPanel);
    filterPanelEl.querySelector('.btn-secondary').addEventListener('click', () => {
      filterPanelEl.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    });
    filterPanelEl.querySelector('.btn-primary').addEventListener('click', toggleFilterPanel);
  }

  // Add widget card
  function addDynamicWidget() {
    const statsContainer = document.querySelector('.stats-container');
    if (!statsContainer) return;
    const box = document.createElement('div');
    box.className = 'stats-box';
    box.innerHTML = `
      <div class="stats-title">Custom widget</div>
      <div class="widget-actions"><button class="btn-danger widget-remove">Remove</button></div>
      <div class="stats-data">
        <div class="stat-item">
          <div class="stat-label">New metric</div>
          <div class="stat-value">--</div>
          <div class="stat-trend">n/a</div>
        </div>
      </div>
    `;
    statsContainer.appendChild(box);

    const removeBtn = box.querySelector('.widget-remove');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      box.remove();
    });
  }

  // Auth modal
  function wireAuth() {
    const userButton = document.querySelector('.user-container');
    if (!userButton) return;
    userButton.style.cursor = 'pointer';
    userButton.addEventListener('click', openAuthModal);
  }

  let authModalEl = null;
  function openAuthModal() {
    if (authModalEl) return;
    authModalEl = document.createElement('div');
    authModalEl.className = 'modal-backdrop';
    authModalEl.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">Welcome</div>
          <button class="modal-close">✕</button>
        </div>
        <div class="modal-tabs">
          <button class="active" data-tab="signin">Sign in</button>
          <button data-tab="signup">Sign up</button>
        </div>
        <div class="modal-body">
          <form class="auth-form" data-mode="signin">
            <label>Email<input type="email" placeholder="you@example.com" required></label>
            <label>Password<input type="password" placeholder="Your password" required></label>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Continue</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(authModalEl);

    const close = () => { authModalEl?.remove(); authModalEl = null; };
    authModalEl.querySelector('.modal-close').addEventListener('click', close);
    authModalEl.addEventListener('click', (e) => { if (e.target === authModalEl) close(); });
    document.addEventListener('keydown', escToClose);

    function escToClose(e){ if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escToClose);} }

    // Tabs switch
    const tabs = authModalEl.querySelectorAll('.modal-tabs button');
    tabs.forEach(btn => btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const form = authModalEl.querySelector('.auth-form');
      if (btn.getAttribute('data-tab') === 'signup') {
        form.setAttribute('data-mode', 'signup');
        form.innerHTML = `
          <label>Full name<input type="text" placeholder="Your name" required></label>
          <label>Email<input type="email" placeholder="you@example.com" required></label>
          <label>Password<input type="password" placeholder="Create a password" required></label>
          <div class="form-actions"><button type="submit" class="btn-primary">Create account</button></div>
        `;
      } else {
        form.setAttribute('data-mode', 'signin');
        form.innerHTML = `
          <label>Email<input type="email" placeholder="you@example.com" required></label>
          <label>Password<input type="password" placeholder="Your password" required></label>
          <div class="form-actions"><button type="submit" class="btn-primary">Continue</button></div>
        `;
      }
    }));

    // Demo submit
    authModalEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const mode = authModalEl.querySelector('.auth-form').getAttribute('data-mode');
      alert(`${mode === 'signup' ? 'Account created' : 'Signed in'} (demo)`);
      const closeBtn = authModalEl.querySelector('.modal-close');
      closeBtn.click();
    });
  }