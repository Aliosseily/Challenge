'use strict';

var FileTreeNode = function(nodeId, name, type) {
  var children = [];

  this.nodeId = nodeId;
  this.name = name;
  this.type = type;
  this.parentNode = null;

  this.setParent = function(parentNode) {
    this.parentNode = parentNode;
  };
  this.addChild = function(node){
    if (this.type !== 'DIRECTORY') {
      throw "Cannot add child node to a non-directory node";
    }
    children.push(node);
    node.setParent(this);
  };
  this.getChildren = function() {
    return children;
  };
};

var FileTree = function() {
  this.nodes = [];

  this.getRootNodes = function() {
    var result = [];
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].parentNode) {
        result.push(this.nodes[i]);
      }
    }
    result.push(this.nodes[0])
    return result;
  };
  this.findNodeById = function(nodeId) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].nodeId === nodeId) {
        return this.nodes[i];
      }
    }
    return null;
  };
  this.createNode = function(nodeId, name, type, parentNode) {
    var node = new FileTreeNode(nodeId, name, type);
    if (parentNode) {
      parentNode.addChild(node);
    }
    this.nodes.push(node);
  }
};

function createFileTree(input) {

  var fileTree = new FileTree();

  // Sorting the input such that each element is followed by his child
  // for (var i = 0; i < input.length-1; i++) {
  //   for (var j = i+1; j < input.length; j++) {
  //     if (input[i].id == input[j].parentId){
  //       var temp = input[i+1];
  //       input[i+1] = input[j];
  //       input[j] = temp;
  //     }
  //   }
  // }

  var parentIds = [];
  for (var i = 0; i < input.length; i++) {
    var inputNode = input[i];
    parentIds.push(inputNode.parentId);
    var parentNode = inputNode.parentId ? fileTree.findNodeById(inputNode.parentId) : null;
    fileTree.createNode(inputNode.id, inputNode.name, inputNode.type, parentNode);
  }
  
  for (var i = 0; i < fileTree.nodes.length; i++) {
    if (!fileTree.nodes[i].parentNode && parentIds[i])
      fileTree.nodes[i].setParent(fileTree.findNodeById(parentIds[i]))
  }
  return fileTree;
}
