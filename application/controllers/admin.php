<?php 

class Admin extends CI_Controller{

	function __construct(){
		parent::__construct();
		
		$this->load->model('m_login');
		$this->load->model('m_data');

		if($this->session->userdata('status') != "login"){
			redirect(base_url("login"));
		}
	}

	function index(){
		$this->load->view('v_admin');	
	}

	public function list_user()
	{
		$data['pengguna']=$this->m_login->getPengguna()->result();
		$this->load->view('v_listuser', $data);
	}
	public function registrasi()
	{
		$username = $this->input->post('username');
		$nama = $this->input->post('nama');
		$alamat = $this->input->post('alamat');
		$email = $this->input->post('e-mail');
		$password = $this->input->post('password');

		$where = array(
			'username' => $username
		);
		$check = $this->m_login->cek_login($where);

		if ($check == false) {
			$data_users = array(
				'username' => $username,
				'email' => $email,
				'password' => $password,
				'role' => 2,
				'active' => "aktif"
			);
			$this->db->insert('users',$data_users);
			
			$data_pengguna = array(
				'nama_pengguna' => $nama,
				'alamat' => $alamat,
				'username' => $username
			);
			$this->db->insert('pengguna', $data_pengguna);

			$_SESSION['alert'] = true;
			redirect(base_url()."index.php/admin/list_user");
		} else {
			echo "username sudah terdaftar";
		}
		
	}

	function hapus_data($username){
		$where = array('username' => $username);
		$this->m_data->hapus_data($where,'users');
		redirect(base_url().'index.php/admin/list_user');
	}
}