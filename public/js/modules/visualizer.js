class Visualizer {

  constructor(width, height, canvas) {

    const dpr = window.devicePixelRatio || 1;

    this.canvas = canvas;
    this.width = width;
    this.height = height;

    /**
     * Canvas resolution correction based on the device pixel-ratio.
     * The canvas is first scaled to it's actual size based on the pixel ratio.
     * Then the bounds of the canvas is reduced to display size using CSS.
     * Then the contents of the canvas are upscaled by the device pixel-ratio.
     * 
     * In the end, we get a sharper canvas with same size elements
     */
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;

    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);

    this.nodes = [];
    this.sender = {
      percentage: 0
    };
  }

  static resolvePerc(perc, total) {
    return parseInt(perc)*total/100;
  }

  /**
   * Updates the positions of all the connected nodes in the graph
   */
  updateAllPos() {
    // Get only the connected nodes by removing the client node
    const nodes = this.nodes.slice(1);

    const divisions = 360/nodes.length;

    nodes.forEach((node, i) => {
      // Calculate the angle that line makes
      const angle = divisions*(i+1)*Math.PI/180;
      
      // Calculate the slope from the angle
      const slope = Math.tan(angle);

      // Assume some value of y from the start
      let cy = 100/this.height * 100;

      // If angle is greater than 180deg, then shift y coordinates to opposite quadrants
      if (angle > Math.PI)
        cy += 50;

      // Calculate x coordinate using the simple line equation
      let cx = ((this.height/2 - cy) / slope) + this.width/2;

      // Handles the special cases
      if (angle == Math.PI) {
        cx = this.width/2 - 120;
        cy = 50;
      }
      else if (angle == 2*Math.PI) {
        cx = this.width/2 + 120;
        cy = 50;
      }

      // Converts x coordinate to a percentage value
      cx = cx/this.width * 100;

      node.cx = cx+'%';
      node.cy = cy+'%';
    });
  }

  /**
   * Adds a node to the graph
   * @param {String} name Name/Identifier of the node. Must be unique
   * @param {Array} pos Array of two elements that have percentage location values of the node
   * @param {Boolean} isClient Dentoes whether the node is the current client
   */
  addNode(name, pos, isClient) {

    const nodeData = {
      name,
      radius: isClient ? 40 : 30,
      cx: pos ? pos[0] : '30%',
      cy: pos ? pos[1] : '30%',
      textColor: isClient ? '#C5C7CC' : '#636979'
    };

    const nodeDuplID = this.nodes.findIndex(node => node.name === name);

    if (nodeDuplID > -1)
      this.nodes[nodeDuplID] = nodeData;
    else
      this.nodes.push(nodeData);

    if (!pos) this.updateAllPos();

    this.updateCanvas();
  }

  /**
   * Removes a node from the graph
   * @param {String} name Identifier of the node
   */
  removeNode(name) {
    const nodeDuplID = this.nodes.findIndex(node => node.name === name);

    if (nodeDuplID > -1) {
      this.nodes.splice(nodeDuplID, 1);
      
      this.updateAllPos();
      this.updateCanvas();
    }

  }

  /**
   * Updates the entire graph by regenerating the SVG
   */
  updateCanvas() {
    /**
     * Empty the canvas, and add the updated nodes, connections and labels
     */
    this.ctx.clearRect(0, 0, this.width, this.height);

    /**
     * Adds the connection links between all the nodes
     */
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i+1; j < this.nodes.length; j++) {

        new CanvasElements.Line({
          x: Visualizer.resolvePerc(this.nodes[i].cx, this.width),
          y: Visualizer.resolvePerc(this.nodes[i].cy, this.height),
          x2: Visualizer.resolvePerc(this.nodes[j].cx, this.width),
          y2: Visualizer.resolvePerc(this.nodes[j].cy, this.height),
          borderWidth: 1.3,
          borderColor: '#636979',
          ctx: this.ctx
        });
      }
    }

    /**
     * Creates the file transfer indicator line
     */
    if (this.sender && this.sender.name) {
      this.addSender(this.sender.name, this.sender.percentage);

      this.nodes.forEach(node => {
        if (node.name === this.sender.name) return;

        // Get the (x, y) coordinates of sender and receiver node
        const x1 = Visualizer.resolvePerc(this.sender.cx, this.width);
        const y1 = Visualizer.resolvePerc(this.sender.cy, this.height);
        const x2 = Visualizer.resolvePerc(node.cx, this.width);
        const y2 = Visualizer.resolvePerc(node.cy, this.height);

        // Calculate the total distance between the node
        const dis = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
        // Calculate the angle of line between the nodes along x axis.
        // Slope is calculated first
        const angle = Math.atan( (y2-y1)/(x2-x1) );

        // Calculate the distance based on percentage value
        let r = this.sender.percentage/100*dis;
        // Direction corrections
        if ((x2 < x1 || y2 < y1) && !(x2 >= x1 && y2 <= y1))
          r = -r;

        // Create the line based on polar system
        new CanvasElements.Line({
          x: x1,
          y: y1,
          r: r,
          angle: angle, 
          borderWidth: 2,
          borderColor: '#3BE8B0',
          ctx: this.ctx
        });
      });
    }

    const primaryColor = d => d.name === this.sender.name || this.sender.percentage >= 99 ? '#3BE8B0' : '#636979';

    /**
     * Adds the nodes
     */
    this.nodes.forEach((node, i) => {

      /**
       * Add waves to current client node
       */
      if (i === 0) {
        const radii = [60, 50];

        radii.forEach(radius =>
          new CanvasElements.Circle({
            x: this.width/2,
            y: this.height/2,
            r: radius,
            // If the current client is the sender, then show green waves, otherwise gray
            background: this.sender.name === node.name ? 'rgba(59, 232, 176, 0.1)' : 'rgba(99, 105, 121, 0.1)',
            ctx: this.ctx
          })
        );
      }

      new CanvasElements.Circle({
        x: Visualizer.resolvePerc(node.cx, this.width),
        y: Visualizer.resolvePerc(node.cy, this.height),
        r: node.radius,
        background: '#0D1322',
        borderColor: primaryColor(node),
        borderWidth: 2.5,
        ctx: this.ctx
      });
    });

    /**
     * Adds the avatar text
     */
    this.nodes.forEach(node => 
      new CanvasElements.Text({
        x: Visualizer.resolvePerc(node.cx, this.width),
        y: Visualizer.resolvePerc(node.cy, this.height),
        text: node.name[0].toUpperCase(),
        font: '"Rubik", sans-serif',
        align: 'center',
        baseline: 'middle',
        size: node.radius/1.2,
        background: primaryColor(node),
        ctx: this.ctx
      })
    );

    /**
     * Adds the nickname labels
     */
    this.nodes.forEach(node => 
      new CanvasElements.Text({
        x: Visualizer.resolvePerc(node.cx, this.width),
        y: Visualizer.resolvePerc(node.cy, this.height) + node.radius + 20,
        text: node.name,
        font: '"Rubik", sans-serif',
        align: 'center',
        baseline: 'middle',
        size: 13,
        background: node.textColor,
        weight: '500',
        ctx: this.ctx
      })
    );
  }


  /**
   * Adds the sender client
   * @param {String} name Name of the client who is sending the files
   * @param {Number} percentage Completed file transfer percentage
   */
  addSender(name, percentage=0) {
    this.sender = {
      ...this.nodes.filter(node => node.name === name)[0],
      percentage
    };
  }

  /**
   * Removes the sender client and resets for next file transfer
   */
  removeSender() {
    this.sender = {
      percentage: 0
    };

    this.updateCanvas();
  }

  /**
   * Updates the file transfer percentage
   * @param {Number} percentage Completed file transfer percentage
   */
  setTransferPercentage(percentage) {
    if (percentage > 100) percentage = 100;

    this.sender.percentage = percentage;

    this.updateCanvas();
  }

}