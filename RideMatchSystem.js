class Coord{
  constructor(lat, lon){
    this.lat = lat;
    this.lon = lon;
  }
}

/**
 * @param {Coord} 
 * @param {Coord} 
 */
function getDistance(point1, point2){ //temporary naive function
  vert = point1.lat - point2.lat;
  hor = point1.lon - point2.lon;
  return Math.sqrt(Math.pow(vert, 2) + Math.pow(hor, 2));
}


class ReqCoord extends Coord{
  constructor(lat, lon, dest) {
    super(lat, lon);
    this.dest = dest;
    this.dist = getDistance(this, dest);
  }
}

class RideMatchSystem{
  constructor(locations, dest){ // O(nlogn) due to sorting
    this.locations = locations;
    this.dest = dest;
    this.locations.sort((coord1, coord2)=>{
      return coord1.dist - coord2.dist;
    }
    );
  }

  matchAlgo1(rideSize){ // O(n^2)
    var rides = [];
    while(this.locations.length > 0){
      let ride = [];
      let cur = this.locations.pop();
      ride.push(cur);
      while(ride.length < rideSize && this.locations.length > 0){
        let next = 0;
        let min_distance = this.locations[0].dist;
        for(let i=0; i<this.locations.length; i++){
          let cur_dist = this.locations[i].dist;
          if(cur_dist < min_distance){
            next = i;
            min_distance = cur_distance;
          } 
        }
        ride.push(this.locations[next]);
        cur = next;
        this.locations.splice(next, 1); // removes element which is O(n), could be improved bool array [T, T, F, ...]
      }
      rides.push(ride);
    }
    return rides;
  }
  
  matchAlgo2(rideSize, threshDist){
    let rides = [];
    while(this.locations.length > 0){
      let ride = [];
      let cur = this.locations.pop();
      ride.push(cur)
      let all_explored = false;
      while(ride.length < rideSize && this.locations.length > 0 && !all_explored){
        let cur_index = 0;
        for(let i=0; i<this.locations.length; i++){
          let next_index = (cur_index + i) % this.locations.length;
          let next = this.locations[next_index];
          let cur_distance = getDistance(cur, next) + next.dist;
          let incremental_distance = cur_distance - cur.dist; // add code to track this
          if(incremental_distance <= threshDist){
            this.locations.splice(next_index, 1);
            ride.push(next);
            cur_index = next_index;
            break;
          }else if(i == this.locations.length-1){
            all_explored = true;
          }
        }
      }
      rides.push(ride);
    }
    return rides;
  }

  matchAlgo3(rideSize, threshDist){
    var rides = []
    var global_visited = new Array(this.locations.length).fill(false);
    let farthest_index = this.locations.length-1;
    while(farthest_index >= 0){
      // DFS
      let visited = global_visited.slice();
      visited[farthest_index] = true;
      let farthest_coord = this.locations[farthest_index];
      let stack = [[farthest_coord, null, 1]]; // [[farthest_coord, 0, 1]]; // [coord, parent pointer, level of node]
      let final_coord = farthest_coord;
      let parent_map = new Map(); // use this to track parent
      let index_map = new Map();
      index_map.set(farthest_coord, farthest_index);
      parent_map.set(farthest_coord, null);
      console.log(parent_map)
      let found_path = false;
      while(stack.length > 0 && !found_path){
        let cur = stack.pop();
        let cur_coord = cur[0];
        let cur_level = cur[2];
        for(let i=0; i<this.locations.length; i++){
          if(visited[i]){
            continue;
          }
          let next = this.locations[i];
          let cur_distance = getDistance(cur_coord, next) + next.dist;
          let incremental_distance = cur_distance - cur_coord.dist; // add code to track this
          if(incremental_distance <= threshDist){
            stack.push([next, cur_coord, cur_level+1]);
            parent_map.set(next, cur_coord);
            index_map.set(next, i);
            final_coord = next;
            if(cur_level + 1 == rideSize){ // early stoppage (first ride found)
              found_path = true;
              break;
            }
            visited[i] = true;
          }
        }
      }
      //recover path
      let ride = [];
      let curr = final_coord;
      console.log(parent_map)
      while(curr != null){
        // console.log(curr)
        ride.push(curr);
        curr = parent_map.get(curr);
      }
      ride.reverse();
      rides.push(ride);

      //mark visited indices globally
      for(let coord of ride){
        global_visited[index_map.get(coord)] = true;
      }

      while(visited[farthest_index]){
        farthest_index--; // total O(n)
      }
    }
    return rides;
  }
} 


function generateTest(coords, rideSize, threshDist){ // generate 
  var destination = new Coord (coords[0][0], coords[0][1]);
  var start_points = [];
  for(var i=1; i<coords.length;i++){ 
    var cur = new ReqCoord(coords[i][0], coords[i][1], destination);
    start_points.push(cur);
  }
  sys = new RideMatchSystem(start_points, destination);
  return sys.matchAlgo1(rideSize, threshDist);
}

function testMetrics(){ // generate test metrics
  return;
}

coords = [[0, 0], [2, 25], [3, 3], [-25, -25], [-9, 5]];
console.log(generateTest(coords, 10, 100));