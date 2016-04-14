'use strict';

angular.module('mfgtoolingApp')
    .controller('DashboardController', function ($scope, $state, $q, Processes, ProcessStep, Attack, ComputerController, PartFacet, QualityControlStep, Vulnerability, Part) {
        var vm = this;
        var arrayNodes = [];
        var arrayLinks = [];

         
        $scope.export = function() {
            var productID = "pid-demo";
            var features = {};
            var units = {};
            var constraints = [];
            var version = "1.0";

            QualityControlStep.query(function(result) {
               for (var i in result) {
                    if(typeof result[i] ==="object" && 'processStep' in result[i]) {
                        var field_feature = result[i]['feature'];
                        var field_customConstraint = result[i]['customConstraint'];

                        if (field_feature) {
                            field_feature = field_feature.split("\n");
                            field_feature.forEach(function(feature) {
                                var tmp = feature.split(",");
                                if (tmp.length==3) {
                                    features[tmp[0]] = tmp[1];
                                    units[tmp[0]] = tmp[2];
                                }                    
                            });
                        }
                        
                        if (field_customConstraint)  {
                            field_customConstraint = field_customConstraint.split("\n");
                            field_customConstraint.forEach(function(constraint) {
                                constraints.push(constraint);          
                            });
                        }                        

                        var jsonObj = {
                            "productID": productID,
                            "feature": features,
                            "unit": units,
                            "constraints": constraints,
                            "version": version,
                        };
                        var jsonData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonObj));
                        $scope.json_export = jsonData;
                    }
                }
            });

            
        };
        $scope.export();

        function checkIfNodeExists(name, type, id) {
            for (var i in arrayNodes) {
                if (arrayNodes[i]['name']==name && arrayNodes[i]['type']==type && arrayNodes[i]['id']==id)
                    return i;
            }
            arrayNodes.push({
                    'name': name,
                    'type': type,
                    'color': colorPattern[type],
                    'id':id,
                });
            return checkIfNodeExists(name, type, id);
        }

        var colorPattern = {
            'processes':3,
            'processStep':1,
            'attack': 8,
            'computerController': 9,
            'partFacet': 4,
            'qualityControlStep': 5,
            'vulnerability': 6,
            'part': 2,
        }

        var colors = d3.scale.category10();
        $scope.entityList = [
            {'type': 'processes', 'color': colors.range()[colorPattern['processes']], 'name':'Process'},
            {'type': 'processStep', 'color': colors.range()[colorPattern['processStep']], 'name':'Process Step'},
            {'type': 'attack', 'color': colors.range()[colorPattern['attack']], 'name':'Attack'},
            {'type': 'computerController', 'color': colors.range()[colorPattern['computerController']], 'name':'Computer Controller'},
            {'type': 'partFacet', 'color': colors.range()[colorPattern['partFacet']], 'name':'Part Facet'},
            {'type': 'part', 'color': colors.range()[colorPattern['part']], 'name':'Part'},
            {'type': 'qualityControlStep', 'color': colors.range()[colorPattern['qualityControlStep']], 'name':'Quality Control Step'},
            {'type': 'vulnerability', 'color': colors.range()[colorPattern['vulnerability']], 'name':'Vulnerability'},
        ];          

        $scope.createEntity = function(type) {
            console.log(type);
            if (type=="processes") {
                var processes = {'name':'new process'};
                var tmp = Processes.save(processes, function(data) {
                    var id = data['id'];
                    var name = data['name'];
                    var type = 'processes';
                    var index0 = checkIfNodeExists(name, type, id);
                    insertNewNode(arrayNodes[index0]);
                }); 
            } else if (type=="processStep") {
                var processStep = {'name':'new processStep'};
                var tmp = ProcessStep.save(processStep, function(data) {
                    var id = data['id'];
                    var name = data['name'];
                    var type = 'processStep';
                    var index0 = checkIfNodeExists(name, type, id);
                    insertNewNode(arrayNodes[index0]);
                });     
            } else if (type=="attack") {
                var attack = {'type':'SCALING'};
                var tmp = Attack.save(attack, function(data) {
                    var id = data['id'];
                    var name = data['type'];
                    var type = 'attack';
                    var index0 = checkIfNodeExists(name, type, id);
                    insertNewNode(arrayNodes[index0]);
                });     
            } else if (type=="computerController") {
                var computerController = {'operatingSystem':'new computerController'};
                var tmp = ComputerController.save(computerController, function(data) {
                    var id = data['id'];
                    var name = data['operatingSystem']+'-'+data['operatingSoftware']+'-'+data['network'];
                    var type = 'computerController';
                    var index0 = checkIfNodeExists(name, type, id);
                    insertNewNode(arrayNodes[index0]);
                });       
            } else if (type=="partFacet") {
                var partFacet = {'name':'LENGTH'};
                var tmp = PartFacet.save(partFacet, function(data) {
                    console.log(data);
                    var id = data['id'];
                    var name = data['name'];
                    var type = 'partFacet';
                    var index0 = checkIfNodeExists(name, type, id);
                    insertNewNode(arrayNodes[index0]);
                });    
            } else if (type=="part") {
                var part = {'name':'new part'};
                var tmp = Part.save(part, function(data) {
                    var id = data['id'];
                    var name = data['name'];
                    var type = 'part';
                    var index0 = checkIfNodeExists(name, type, id);
                    insertNewNode(arrayNodes[index0]);
                }); 
            } else if (type=="qualityControlStep") {
                var qualityControlStep = {'name':'new qualityControlStep'};
                var tmp = QualityControlStep.save(qualityControlStep, function(data) {
                    var id = data['id'];
                    var name = data['name'];
                    var type = 'qualityControlStep';
                    var index0 = checkIfNodeExists(name, type, id);
                    insertNewNode(arrayNodes[index0]);
                });      
            } else if (type=="vulnerability") {
                var vulnerability = {'name':'new vulnerability'};
                var tmp = Vulnerability.save(vulnerability, function(data) {
                    var id = data['id'];
                    var name = data['name'];
                    var type = 'vulnerability';
                    var index0 = checkIfNodeExists(name, type, id);
                    insertNewNode(arrayNodes[index0]);
                });     
            }
        };

        var onSaveFinished = function () {
            $scope.export();
            $scope.loadAll();
        };

        $scope.loadAll = function() {
            arrayNodes = [];
            arrayLinks = [];

            $scope.Processes = Processes.query(function(result) {
               for (var i in result) {
                    if(typeof result[i] ==="object" && 'startingStep' in result[i]) {
                        var id = result[i]['id'];
                        var name = result[i]['name'];
                        var type = 'processes';
                        var index0 = checkIfNodeExists(name, type, id);

                        if (result[i]['startingStep']) {                
                            id = result[i]['startingStep']['id'];
                            name = result[i]['startingStep']['name'];
                            type = 'processStep';
                            var index1 = checkIfNodeExists(name, type, id);

                            arrayLinks.push({
                                'sourceIndex': index0,
                                'targetIndex': index1,
                                'left': false,
                                'right': true,
                            });
                        }
                    }
                }
            });

            $scope.ProcessStep = ProcessStep.query(function(result) {
               for (var i in result) {
                    if(typeof result[i] ==="object" && 'following' in result[i]) {
                        var id = result[i]['id'];
                        var name = result[i]['name'];
                        var type = 'processStep';
                        var index0 = checkIfNodeExists(name, type, id);

                        if (result[i]['following']!==null) {                            
                            id = result[i]['following']['id'];
                            name = result[i]['following']['name'];
                            type = 'processStep';
                            var index1 = checkIfNodeExists(name, type, id);

                            arrayLinks.push({
                                'sourceIndex': index0,
                                'targetIndex': index1,
                                'left': false,
                                'right': true,
                            });
                        }

                        if (result[i]['partFacet']!==null) {                            
                            id = result[i]['partFacet']['id'];
                            name = result[i]['partFacet']['name'];
                            type = 'partFacet';
                            var index1 = checkIfNodeExists(name, type, id);

                            arrayLinks.push({
                                'sourceIndex': index0,
                                'targetIndex': index1,
                                'left': false,
                                'right': false,
                            });
                        }
                    }
                }
            });

            $scope.Attack = Attack.query(function(result) {
               for (var i in result) {
                    console.log(result[i]);
                    if(typeof result[i] ==="object" && 'processStep' in result[i]) {
                        var id = result[i]['id'];
                        var name = result[i]['type'];
                        var type = 'attack';
                        var index0 = checkIfNodeExists(name, type, id);

                        if (result[i]['processStep']!==null) {                            
                            id = result[i]['processStep']['id'];
                            name = result[i]['processStep']['name'];
                            type = 'processStep';
                            var index1 = checkIfNodeExists(name, type, id);

                            arrayLinks.push({
                                'sourceIndex': index0,
                                'targetIndex': index1,
                                'left': false,
                                'right': false,
                            });
                        }
                    }
                }
            });

            $scope.ComputerController = ComputerController.query(function(result) {
               for (var i in result) {
                    if(typeof result[i] ==="object" && 'processStep' in result[i]) {
                        var id = result[i]['id'];
                        var name = result[i]['operatingSystem']+'-'+result[i]['operatingSoftware']+'-'+result[i]['network'];
                        var type = 'computerController';
                        var index0 = checkIfNodeExists(name, type, id);

                        if (result[i]['processStep']!==null) {                            
                            id = result[i]['processStep']['id'];
                            name = result[i]['processStep']['name'];
                            type = 'processStep';
                            var index1 = checkIfNodeExists(name, type, id);

                            arrayLinks.push({
                                'sourceIndex': index0,
                                'targetIndex': index1,
                                'left': false,
                                'right': false,
                            });
                        }
                    }
                }
            });

            $scope.PartFacet = PartFacet.query(function(result) {
               for (var i in result) {
                    if(typeof result[i] ==="object" && 'part' in result[i]) {
                        var id = result[i]['id'];
                        var name = result[i]['name'];
                        var type = 'partFacet';
                        var index0 = checkIfNodeExists(name, type, id);

                        if (result[i]['part']!==null) {                            
                            id = result[i]['part']['id'];
                            name = result[i]['part']['name'];
                            type = 'part';
                            var index1 = checkIfNodeExists(name, type, id);

                            arrayLinks.push({
                                'sourceIndex': index0,
                                'targetIndex': index1,
                                'left': false,
                                'right': false,
                            });
                        }
                    }
                }
            });

            $scope.Part = Part.query(function(result) {
               for (var i in result) {
                    if(typeof result[i] ==="object" && 'name' in result[i]) {
                        var id = result[i]['id'];
                        var name = result[i]['name'];
                        var type = 'part';
                        var index0 = checkIfNodeExists(name, type, id);
                    }
                }
            });

            $scope.QualityControlStep = QualityControlStep.query(function(result) {
               for (var i in result) {
                    if(typeof result[i] ==="object" && 'processStep' in result[i]) {
                        var id = result[i]['id'];
                        var name = result[i]['name'];
                        var type = 'qualityControlStep';
                        var index0 = checkIfNodeExists(name, type, id);

                        if (result[i]['processStep']!==null) {                            
                            id = result[i]['processStep']['id'];
                            name = result[i]['processStep']['name'];
                            type = 'processStep';
                            var index1 = checkIfNodeExists(name, type, id);

                            arrayLinks.push({
                                'sourceIndex': index0,
                                'targetIndex': index1,
                                'left': false,
                                'right': false,
                            });
                        }
                    }
                }
            });

            $scope.Vulnerability = Vulnerability.query(function(result) {
               for (var i in result) {
                    if(typeof result[i] ==="object" && 'computerController' in result[i]) {
                        var id = result[i]['id'];
                        var name = result[i]['name'];
                        var type = 'vulnerability';
                        var index0 = checkIfNodeExists(name, type, id);

                        if (result[i]['computerController']!==null) {                            
                            id = result[i]['computerController']['id'];
                            name = result[i]['computerController']['operatingSystem']+'-'+result[i]['computerController']['operatingSoftware']+'-'+result[i]['computerController']['network'];
                            type = 'computerController';
                            var index1 = checkIfNodeExists(name, type, id);

                            arrayLinks.push({
                                'sourceIndex': index0,
                                'targetIndex': index1,
                                'left': false,
                                'right': false,
                            });
                        }
                    }
                }
            });

            $q.all([
                $scope.Processes.$promise,
                $scope.ProcessStep.$promise,
                $scope.Attack.$promise,
                $scope.ComputerController.$promise,
                $scope.PartFacet.$promise,
                $scope.QualityControlStep.$promise,
                $scope.Vulnerability.$promise,
                $scope.Part.$promise,
            ]).then(function() { 
                // restart(arrayNodes, arrayLinks);
                // removeAllNodesAndLinks();
                updateNodesAndLinks(arrayNodes, arrayLinks);


            });
        };
        $scope.loadAll();

        $scope.updateLink = function(source, target, isDelete) {
            var node1_id = source['originalid'];
            var node1_type = source['type'];
            var node2_id = target['originalid'];
            var node2_type = target['type'];
            console.log(node1_id + node1_type + node2_id + node2_type);

            if (node1_type=="processes") {
                Processes.get({id: node1_id}, function(result) {
                    if (node2_type=="processStep") {
                        delete result['$promise'];
                        delete result['$resolve'];

                        if (isDelete) {
                             result.startingStep = null;
                             Processes.update(result);
                         } else {
                            ProcessStep.get({id: node2_id}, function(result2) {
                                delete result2['$promise'];
                                delete result2['$resolve'];
                                result.startingStep = result2;
                                Processes.update(result);
                            });
                         }
                    }
                });
            } else if (node1_type=="processStep") {
                ProcessStep.get({id: node1_id}, function(result) {
                    if (node2_type=="processStep") {
                        delete result['$promise'];
                        delete result['$resolve'];
                        if (isDelete) {
                             result.following = null;
                             ProcessStep.update(result);
                         } else {
                            ProcessStep.get({id: node2_id}, function(result2) {
                                delete result2['$promise'];
                                delete result2['$resolve'];
                                result.following = result2;
                                ProcessStep.update(result);
                            });
                         }
                    } else if (node2_type=="partFacet") {
                        delete result['$promise'];
                        delete result['$resolve'];
                        if (isDelete) {
                             result.partFacet = null;
                             ProcessStep.update(result);
                         } else {
                            PartFacet.get({id: node2_id}, function(result2) {
                                delete result2['$promise'];
                                delete result2['$resolve'];
                                result.partFacet = result2;
                                ProcessStep.update(result);
                            });
                         }
                    }
                });
            } else if (node1_type=="attack") {
                Attack.get({id: node1_id}, function(result) {
                    if (node2_type=="processStep") {
                        result.processStep = null;
                        delete result['$promise'];
                        delete result['$resolve'];
                        if (isDelete) {
                             result.processStep = null;
                             Attack.update(result);
                         } else {
                            ProcessStep.get({id: node2_id}, function(result2) {
                                delete result2['$promise'];
                                delete result2['$resolve'];
                                result.processStep = result2;
                                Attack.update(result);
                            });
                         }
                    }
                });
            } else if (node1_type=="computerController") {
                ComputerController.get({id: node1_id}, function(result) {
                    if (node2_type=="processStep") {
                        delete result['$promise'];
                        delete result['$resolve'];
                         if (isDelete) {
                             result.processStep = null;
                             ComputerController.update(result);
                         } else {
                            ProcessStep.get({id: node2_id}, function(result2) {
                                delete result2['$promise'];
                                delete result2['$resolve'];
                                result.processStep = result2;
                                ComputerController.update(result);
                            });
                         }
                    }
                });
            } else if (node1_type=="partFacet") {
                PartFacet.get({id: node1_id}, function(result) {
                    if (node2_type=="part") {
                        delete result['$promise'];
                        delete result['$resolve'];
                        if (isDelete) {
                             result.part = null;
                             PartFacet.update(result);
                         } else {
                            Part.get({id: node2_id}, function(result2) {
                                delete result2['$promise'];
                                delete result2['$resolve'];
                                result.part = result2;
                                PartFacet.update(result);
                            });
                         }
                    }
                });
            } else if (node1_type=="qualityControlStep") {
                QualityControlStep.get({id: node1_id}, function(result) {
                    if (node2_type=="processStep") {
                        delete result['$promise'];
                        delete result['$resolve'];
                        if (isDelete) {
                             result.processStep = null;
                             QualityControlStep.update(result);
                         } else {
                            ProcessStep.get({id: node2_id}, function(result2) {
                                delete result2['$promise'];
                                delete result2['$resolve'];
                                result.processStep = result2;
                                QualityControlStep.update(result);
                            });
                         }
                    }
                });
            } else if (node1_type=="vulnerability") {
                Vulnerability.get({id: node1_id}, function(result) {
                    if (node2_type=="computerController") {
                        delete result['$promise'];
                        delete result['$resolve'];
                        if (isDelete) {
                             result.computerController = null;
                             Vulnerability.update(result);
                         } else {
                            ComputerController.get({id: node2_id}, function(result2) {
                                delete result2['$promise'];
                                delete result2['$resolve'];
                                result.computerController = result2;
                                Vulnerability.update(result);
                            });
                         }
                    }
                });
            }
        }

        $scope.deleteNode = function(node) {
            var node_type = node['type'];
            var node_id = node['originalid'];
            console.log(node_type+"|"+node_id);
            if (node_type=="processes") {
                Processes.delete({id:node_id});
            } else if (node_type=="processStep") {
                ProcessStep.delete({id:node_id});
            } else if (node_type=="attack") {
                Attack.delete({id:node_id});
            } else if (node_type=="computerController") {
                ComputerController.delete({id:node_id});
            } else if (node_type=="partFacet") {
                PartFacet.delete({id:node_id});
            } else if (node_type=="qualityControlStep") {
                QualityControlStep.delete({id:node_id});
            } else if (node_type=="vulnerability") {
                Vulnerability.delete({id:node_id});
            } else if (node_type=="part") {
                Part.delete({id:node_id});
            }
        }

        // $scope.renameNode = function(node, name) {
        //     var node_type = node['type'];
        //     var node_id = node['originalid'];
        //     console.log(node_type+"|"+node_id);
        //     if (node_type=="processes") {
        //         Processes.get({id: node_id}, function(result) {
        //             result.name = name;
        //             delete result['$promise'];
        //             delete result['$resolve'];
        //             Processes.update(result);
        //         });
        //     } else if (node_type=="processStep") {
        //         ProcessStep.delete({id:node_id});
        //     } else if (node_type=="attack") {
        //         Attack.delete({id:node_id});
        //     } else if (node_type=="computerController") {
        //         ComputerController.delete({id:node_id});
        //     } else if (node_type=="partFacet") {
        //         PartFacet.delete({id:node_id});
        //     } else if (node_type=="qualityControlStep") {
        //         QualityControlStep.delete({id:node_id});
        //     } else if (node_type=="vulnerability") {
        //         Vulnerability.delete({id:node_id});
        //     } else if (node_type=="part") {
        //         Part.delete({id:node_id});
        //         Part.get({id: node_id}, function(result) {
        //             result.name = name;
        //             delete result['$promise'];
        //             delete result['$resolve'];
        //             Processes.update(result);
        //         });
        //     }
        // };

        // $scope.deleteLink = function(source, target) {
        //     var node1_id = source['originalid'];
        //     var node1_type = source['type'];
        //     var node2_id = target['originalid'];
        //     var node2_type = target['type'];
        //     console.log(node1_id + node1_type + node2_id + node2_type);
        //     if (node1_type=="processes") {
        //         Processes.get({id: node1_id}, function(result) {
        //             if (node2_type=="processStep") {
        //                 result.startingStep = null;
        //                 delete result['$promise'];
        //                 delete result['$resolve'];
        //             }
        //             Processes.update(result, onSaveFinished);

        //         });
        //     } else if (node1_type=="processStep") {
        //         ProcessStep.get({id: node1_id}, function(result) {
        //             if (node2_type=="processStep") {
        //                 result.following = null;
        //                 delete result['$promise'];
        //                 delete result['$resolve'];
        //             } else if (node2_type=="partFacet") {
        //                 result.partFacet = null;
        //                 delete result['$promise'];
        //                 delete result['$resolve'];
        //             }
        //             ProcessStep.update(result, $scope.refresh);
        //         });
        //     } else if (node1_type=="attack") {
        //         Attack.get({id: node1_id}, function(result) {
        //             if (node2_type=="processStep") {
        //                 result.processStep = null;
        //                 delete result['$promise'];
        //                 delete result['$resolve'];
        //             }
        //             Attack.update(result, $scope.refresh);
        //         });
        //     } else if (node1_type=="computerController") {
        //         ComputerController.get({id: node1_id}, function(result) {
        //             if (node2_type=="processStep") {
        //                 result.processStep = null;
        //                 delete result['$promise'];
        //                 delete result['$resolve'];
        //             }
        //             ComputerController.update(result, $scope.refresh);
        //         });
        //     } else if (node1_type=="partFacet") {
        //         PartFacet.get({id: node1_id}, function(result) {
        //             if (node2_type=="part") {
        //                 result.part = null;
        //                 delete result['$promise'];
        //                 delete result['$resolve'];
        //             }
        //             PartFacet.update(result, $scope.refresh);
        //         });
        //     } else if (node1_type=="qualityControlStep") {
        //         QualityControlStep.get({id: node1_id}, function(result) {
        //             if (node2_type=="processStep") {
        //                 result.processStep = null;
        //                 delete result['$promise'];
        //                 delete result['$resolve'];
        //             }
        //             QualityControlStep.update(result, $scope.refresh);
        //         });
        //     } else if (node1_type=="vulnerability") {
        //         Vulnerability.get({id: node1_id}, function(result) {
        //             if (node2_type=="computerController") {
        //                 result.computerController = null;
        //                 delete result['$promise'];
        //                 delete result['$resolve'];
        //             }
        //             Vulnerability.update(result, $scope.refresh);
        //         });
        //     }
        // }

        $scope.refresh = function () {
            // arrayNodes = [];
            // arrayLinks = [];
            $scope.loadAll();
            
            // $scope.clear();
        };

        $scope.clear = function () {
            $scope.processes = {
                type: null,
                id: null
            };
        };
    });
