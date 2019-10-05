pragma solidity >= 0.5 .0;
pragma experimental ABIEncoderV2;

/**==================================import external contracts section ==================================*/

import "./SafeMath.sol";

contract Amanga {
    using SafeMath
    for uint256;
    /**==================================modifier definition section ==================================*/
    modifier only_owner() {
        require(msg.sender == owner, "only owner can make this call");
        _;
    }

    /**==================================struct definition section ==================================*/
    struct Report {
        address reporter;
        bytes article_url;
        bytes32 reason;
        uint256 up_votes;
        uint256 down_votes;
        uint256 reported_times;
        uint date;
        bytes thash;
        bool active;
    }
    struct Reporter {
        address id;
        bytes[] urls_reported;
        uint max_articles;
        uint max_up_down_votes;
        bool active;
    }
    /**==================================contract variable definition section ==================================*/


    mapping(bytes => Report) reported_urls;
    mapping(address => Reporter) reporters;
    bytes[] private urls_reported;
    address[] private reporter_keys;
    address owner;
    uint internal max_daily_reports = 3;
    uint internal max_up_votes = 5;
    uint internal max_up_down_votes_daily = 2;
    uint internal min_token_payout = 100;
    /**==================================function definition section ==================================*/
    constructor() public {
        require(msg.sender != address(0), "invalid sender address");
        owner = msg.sender;
    }


    /**==================================reporter function definition section ==================================*/

    function register_reporter(address user) internal {
        reporters[user].id = user;
        reporters[user].max_up_down_votes = max_up_down_votes_daily;
        reporters[user].active = true;
        reporter_keys.push(user);
        reporters[user].max_articles = max_daily_reports;

    }
    /**==================================url reports function definition section ==================================*/
    function report_url(bytes memory url, bytes32 reason, address user) public returns(bool) {
        require(user != address(0), "invalid sender address");
        if (!reporters[user].active) {
            register_reporter(user);
        }
        if (!reported_urls[url].active) {
            reported_urls[url].reporter = user;
            reported_urls[url].article_url = url;
            reported_urls[url].reported_times = reported_urls[url].reported_times.add(1);
            reported_urls[url].active = true;
            reported_urls[url].date = now;
            reported_urls[url].reason = reason;
            urls_reported.push(url);
            reporters[user].urls_reported.push(url);
        } else if (reported_urls[url].reporter != user) {
            require(reporters[user].max_articles > 0, "reached max reports");
            reported_urls[url].reported_times = reported_urls[url].reported_times.add(1);
        }
        return true;
    }

    function save_url_thash(bytes memory url, bytes memory thash) public returns(bool) {
        require(reported_urls[url].active, "url not reported");
        reported_urls[url].thash = thash;

    }

    function up_down_vote_url(bytes memory url, uint up_down_vote, address user) public returns(bool) {
        require(user != address(0), "invalid sender address");
        require(reported_urls[url].active, "url not reported");
        require(reported_urls[url].reporter != user, "url reporter not allowed to up or down vote");
        if (!reporters[user].active) {
            register_reporter(user);
        }
        require(reporters[user].max_up_down_votes > 0, "ran out of daily votes");
        require(up_down_vote == 1 || up_down_vote == 0, "invalid up_vote down vote number");

        if (up_down_vote == 1) { //@dev up vote
            reported_urls[url].up_votes = reported_urls[url].up_votes.add(1);
        } else if (up_down_vote == 0) { //@dev downvotes
            reported_urls[url].down_votes = reported_urls[url].down_votes.add(1);
        }
        if (reporters[user].max_up_down_votes - 1 < 0) {
            reporters[user].max_up_down_votes = 0;
        } else {
            reporters[user].max_up_down_votes = reporters[user].max_up_down_votes.sub(1);
        }
        return true;
    }

    function check_reached_max_votes(bytes memory url) public view returns(bool) {
        return reported_urls[url].up_votes >= max_up_votes;
    }


    function is_url_reported(bytes memory url) public view returns(bool) {
        return reported_urls[url].active;
    }

    function get_urls_reported_keys() public view returns(bytes[] memory) {
        return urls_reported;
    }

    function get_url_details(bytes memory url) public view returns(address, uint256, uint256, bytes memory, uint, bytes32) {
        return (reported_urls[url].reporter, reported_urls[url].up_votes, reported_urls[url].down_votes, reported_urls[url].thash, reported_urls[url].date, reported_urls[url].reason);
    }
    /**==================================contract owner function definition section ==================================*/
    function get_min_token_payout() public only_owner view returns(uint256) {
        return min_token_payout;
    }
}