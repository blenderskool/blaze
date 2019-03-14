class Visualizer {

  constructor(width, height, canvas) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;

    this.nodes = [];
    this.sender = {
      percentage: 0
    };
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
      let cy = 100/this.canvas.height * 100;

      // If angle is greater than 180deg, then shift y coordinates to opposite quadrants
      if (angle > Math.PI)
        cy += 50;

      // Calculate x coordinate using the simple line equation
      let cx = ((this.canvas.height/2 - cy) / slope) + this.canvas.width/2;

      // Handles the special cases
      if (angle == Math.PI) {
        cx = this.canvas.width/2 - 120;
        cy = 50;
      }
      else if (angle == 2*Math.PI) {
        cx = this.canvas.width/2 + 120;
        cy = 50;
      }

      // Converts x coordinate to a percentage value
      cx = cx/this.canvas.width * 100;

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

    /**
     * Add waves if client node
     */
    if (isClient) {
      const radii = [60, 50];

      radii.forEach(radius =>
        new CanvasElements.Circle({
          x: this.canvas.width/2,
          y: this.canvas.height/2,
          r: radius,
          background: 'rgba(99, 105, 121, 0.1)',
          ctx: this.canvas.getContext('2d')
        })
      );
    }

    if (!pos) this.updateAllPos();

    this.updateSVG();
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
      this.updateSVG();
    }

  }

  /**
   * Updates the entire graph by regenerating the SVG
   */
  updateSVG() {
    /**
     * Empty the SVG container, and add the updated nodes, connections and labels
     */
    this.svgContainer.selectAll('*:not(.wave)').remove();

    /**
     * Adds the connection links between all the nodes
     */
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i+1; j < this.nodes.length; j++) {
        
        this.svgContainer.append('line')
        .attr('x1', this.nodes[i].cx)
        .attr('y1', this.nodes[i].cy)
        .attr('x2', this.nodes[j].cx)
        .attr('y2', this.nodes[j].cy)
        .style('stroke-width', 1.3)
        .style('stroke', '#636979');
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
        const x1 = parseInt(this.sender.cx)/100*this.canvas.width;
        const y1 = parseInt(this.sender.cy)/100*this.canvas.height;
        const x2 = parseInt(node.cx)/100*this.canvas.width;
        const y2 = parseInt(node.cy)/100*this.canvas.height;

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

        // Create the line by converting polar to cartesian coordinates
        this.svgContainer.append('line')
        .style('stroke', '#3BE8B0')
        .style('stroke-width', 2)    
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x1 + r*Math.cos(angle))
        .attr('y2', y1 + r*Math.sin(angle));
      });
    }

    const primaryColor = d => d.name === this.sender.name || this.sender.percentage >= 99 ? '#3BE8B0' : '#636979';

    /**
     * Adds the nodes
     */
    this.nodes.forEach(node =>
      new CanvasElements.Circle({
        x: node.cx,
        y: node.cy,
        r: node.radius,
        background: '#0D1322',
        borderColor: primaryColor(node),
        borderWidth: 2.5,
        ctx: this.canvas.getContext('2d')
      })
    );

    /**
     * Adds the avatar text
     */
    this.nodes.forEach(node => 
      new CanvasElements.Text({
        x: node.cx,
        y: node.cy,
        text: node.name[0].toUpperCase(),
        font: '"Rubik", sans-serif',
        align: 'center',
        baseline: 'middle',
        size: node.radius/1.2,
        background: primaryColor(node),
        ctx: this.canvas.getContext('2d')
      })
    );

    /**
     * Adds the nickname labels
     */
    this.nodes.forEach(node => 
      new CanvasElements.Text({
        x: node.cx,
        y: parseInt(node.cy)/100*this.canvas.height + node.radius + 20,
        text: node.name,
        font: '"Rubik", sans-serif',
        align: 'center',
        baseline: 'middle',
        size: 13,
        background: node.textColor,
        weight: '500',
        ctx: this.canvas.getContext('2d')
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

    /**
     * If the current client is the sender, then transition the color of waves to green
     */
    if (name === this.nodes[0].name) {
      this.svgContainer.selectAll('.wave')
      .transition()
        .duration(400)
        .ease(d3.easeLinear)
        .style('fill', 'rgba(59, 232, 176, 0.1)');

    }
  }

  /**
   * Removes the sender client and resets for next file transfer
   */
  removeSender() {
    this.sender = {
      percentage: 0
    };

    /**
     * Reset the wave colors
     */
    this.svgContainer.selectAll('.wave')
    .transition()
      .duration(400)
      .ease(d3.easeLinear)
      .style('fill', 'rgba(99, 105, 121, 0.1)');

    this.updateSVG();
  }

  /**
   * Updates the file transfer percentage
   * @param {Number} percentage Completed file transfer percentage
   */
  setTransferPercentage(percentage) {
    if (percentage > 100) percentage = 100;

    this.sender.percentage = percentage;

    this.updateSVG();
  }

}